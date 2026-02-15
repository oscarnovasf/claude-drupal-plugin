---
name: change-name
description: Renombra un módulo o tema de Drupal cambiando nombres de archivos y contenido
---

# Skill de Renombrado de Módulos y Temas de Drupal

Estás ayudando con el renombrado completo de un módulo o tema de Drupal,
actualizando tanto los nombres de archivos como su contenido interno.

## Capacidades

Esta skill te permite:
- **Renombrar módulos de Drupal** - Cambiar el nombre de un módulo custom
- **Renombrar temas de Drupal** - Cambiar el nombre de un tema custom
- Actualizar todos los archivos relacionados automáticamente
- Actualizar el contenido de los archivos con el nuevo nombre
- Mantener la integridad del proyecto después del renombrado

## Detección de Escenario

**PRIMER PASO OBLIGATORIO: Detectar el escenario actual**

Seguir este flujo de decisión en orden:

### 1. Determinar el contexto actual

La skill puede ejecutarse desde dos contextos:

**A) Desde la carpeta raíz de un módulo/tema** (existe `.info.yml` en el directorio actual)
**B) Desde la raíz del proyecto Drupal** (existe `composer.json` con dependencias de Drupal)

### 2. Verificar contexto y buscar módulos/temas

```bash
# Verificar si estamos en la carpeta de un módulo/tema
if [ -f *.info.yml 2>/dev/null ]; then
  CONTEXT="module_or_theme"
else
  # Verificar si estamos en la raíz del proyecto Drupal
  if [ -f "composer.json" ] && grep -q "drupal" composer.json 2>/dev/null; then
    CONTEXT="drupal_root"
  else
    CONTEXT="unknown"
  fi
fi
```

### 3. Según el contexto, ejecutar el flujo correspondiente

#### Caso A: Contexto = "module_or_theme" (ya estamos en la carpeta correcta)

Continuar directamente al **Paso 4: Detectar nombres del proyecto**.

#### Caso B: Contexto = "drupal_root" (estamos en la raíz del proyecto)

Buscar módulos y temas custom disponibles:

```bash
# Buscar módulos custom
CUSTOM_MODULES=()
if [ -d "web/modules/custom" ]; then
  while IFS= read -r -d '' info_file; do
    module_name=$(basename "$info_file" .info.yml)
    module_path=$(dirname "$info_file")
    CUSTOM_MODULES+=("$module_name|$module_path")
  done < <(find web/modules/custom -maxdepth 2 -name "*.info.yml" -print0 2>/dev/null)
fi

# Buscar temas custom
CUSTOM_THEMES=()
if [ -d "web/themes/custom" ]; then
  while IFS= read -r -d '' info_file; do
    theme_name=$(basename "$info_file" .info.yml)
    theme_path=$(dirname "$info_file")
    CUSTOM_THEMES+=("$theme_name|$theme_path")
  done < <(find web/themes/custom -maxdepth 2 -name "*.info.yml" -print0 2>/dev/null)
fi
```

**Si NO se encuentran módulos ni temas custom** → **DETENER**. Informar al usuario:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  No se encontraron módulos o temas custom
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No se han encontrado módulos en web/modules/custom/ ni temas en
web/themes/custom/ que puedan ser renombrados.

Opciones:
  • Si tienes un módulo/tema en otra ubicación, navega a su carpeta
    y ejecuta esta skill de nuevo
  • Si aún no has creado el módulo/tema, créalo primero

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Si se encuentran módulos/temas**, mostrar lista y solicitar selección:

Usar `AskUserQuestion` para permitir al usuario seleccionar:

```
Selecciona el módulo o tema que deseas renombrar:
```

Opciones (generar dinámicamente basándose en lo encontrado):
- Para cada módulo: `[Módulo] nombre_modulo (web/modules/custom/nombre_modulo)`
- Para cada tema: `[Tema] nombre_tema (web/themes/custom/nombre_tema)`

Ejemplo de opciones:
```
- label: "[Módulo] mi_modulo (web/modules/custom/mi_modulo)"
  description: "Módulo custom: Mi Módulo"

- label: "[Tema] mi_tema (web/themes/custom/mi_tema)"
  description: "Tema custom: Mi Tema"
```

Una vez seleccionado, **guardar el TARGET_DIR** y continuar al **Paso 4**.

#### Caso C: Contexto = "unknown" (ubicación no reconocida)

**DETENER**. Informar al usuario:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Ubicación no reconocida
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Esta skill debe ejecutarse desde:
  • La raíz de un proyecto Drupal (donde está composer.json), o
  • La carpeta raíz de un módulo o tema (donde está el .info.yml)

Directorio actual: {{PWD}}

Por favor, navega a una de estas ubicaciones y ejecuta la skill de nuevo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Detectar nombres del proyecto

**Si venimos del Caso A** (ya estamos en la carpeta del módulo/tema):

```bash
# Nombre antiguo: del archivo .info.yml
OLD_NAME=$(ls *.info.yml | head -1 | xargs -n 1 basename --suffix=.info.yml)

# Nombre nuevo: del nombre de la carpeta actual
NEW_NAME=$(basename "$(pwd)")

# Directorio de trabajo
TARGET_DIR="."
```

**Si venimos del Caso B** (seleccionamos desde la raíz del proyecto):

```bash
# Cambiar al directorio seleccionado
cd "$TARGET_DIR"

# Nombre antiguo: del archivo .info.yml
OLD_NAME=$(ls *.info.yml | head -1 | xargs -n 1 basename --suffix=.info.yml)

# Nombre nuevo: pedir al usuario
```

**IMPORTANTE para Caso B**: Cuando se selecciona desde la raíz del proyecto, debemos preguntar al usuario cuál será el nuevo nombre.

Usar `AskUserQuestion` para solicitar el nuevo nombre:

```
¿Cuál será el nuevo nombre para "{{OLD_NAME}}"?

IMPORTANTE:
  • Usa snake_case (guiones bajos): mi_nuevo_modulo
  • Solo letras minúsculas, números y guiones bajos
  • Debe ser un nombre válido para Drupal
```

Permitir al usuario ingresar el nuevo nombre mediante la opción "Other" (texto libre).

**Validar el nuevo nombre**:

```bash
# Validar formato del nombre (solo letras minúsculas, números y guiones bajos)
if ! [[ "$NEW_NAME" =~ ^[a-z][a-z0-9_]*$ ]]; then
  echo "❌ ERROR: El nombre debe estar en snake_case (solo letras minúsculas, números y guiones bajos)"
  exit 1
fi

# Verificar que el nombre no esté vacío
if [ -z "$NEW_NAME" ]; then
  echo "❌ ERROR: El nombre no puede estar vacío"
  exit 1
fi
```

### 5. Verificar que los nombres son diferentes

**Si `OLD_NAME` es igual a `NEW_NAME`** → **DETENER**. Informar al usuario:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Nombres idénticos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El nombre actual "{{OLD_NAME}}" es igual al nombre nuevo "{{NEW_NAME}}".
No hay nada que renombrar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6. Proyecto válido detectado → Continuar

Si se llega a este punto, estamos en un módulo/tema de Drupal válido con nombres diferentes.
Continuar al flujo de renombrado.

---

## Flujo de Renombrado

**Detectado: Módulo o tema de Drupal válido**

### Paso 1: Asegurar que estamos en el directorio correcto

```bash
# Si TARGET_DIR no es ".", cambiar al directorio del módulo/tema
if [ "$TARGET_DIR" != "." ]; then
  cd "$TARGET_DIR"
  echo "Cambiando al directorio: $TARGET_DIR"
fi
```

### Paso 2: Mostrar información del renombrado

Mostrar al usuario la información detectada:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Renombrado de Proyecto Drupal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Información del cambio:
   Ubicación:       {{TARGET_DIR}}
   Nombre anterior: {{OLD_NAME}}
   Nombre nuevo:    {{NEW_NAME}}

🔄 Acciones a realizar:
   [ ] 1. Renombrar archivos que contienen "{{OLD_NAME}}"
   [ ] 2. Actualizar contenido interno de todos los archivos
   [ ] 3. Actualizar variantes con guiones ({{OLD_NAME_DASH}} → {{NEW_NAME_DASH}})
   [ ] 4. Renombrar la carpeta del módulo/tema

⚠️  IMPORTANTE: Esta acción modificará múltiples archivos.
   Se recomienda tener los cambios actuales en git antes de proceder.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Nota**: `{{OLD_NAME_DASH}}` y `{{NEW_NAME_DASH}}` son las versiones con guiones en lugar de guiones bajos (ej. `mi_modulo` → `mi-modulo`).

### Paso 3: Solicitar confirmación del usuario

Usar `AskUserQuestion` para confirmar:

```
¿Estás seguro de que quieres renombrar el proyecto de "{{OLD_NAME}}" a "{{NEW_NAME}}"?
```

Opciones:
- **Sí, continuar** - Proceder con el renombrado
- **No, cancelar** - Detener la operación

Si el usuario cancela, terminar la ejecución sin realizar cambios.

### Paso 4: Renombrar archivos dentro del módulo/tema

**IMPORTANTE**: Renombrar los archivos ANTES de modificar su contenido.

```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Renombrando archivos internos..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Renombrar todos los archivos que contienen el nombre antiguo
find . -type f -name "*${OLD_NAME}*" -print0 | while IFS= read -r -d '' file; do
  newfile=$(echo "$file" | sed "s/${OLD_NAME}/${NEW_NAME}/g")
  if [ "$file" != "$newfile" ]; then
    echo "  $file → $newfile"
    mv "$file" "$newfile"
  fi
done
```

### Paso 5: Actualizar contenido de archivos

**IMPORTANTE**: Actualizar en dos pasadas (con guiones bajos y con guiones).

```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Actualizando contenido de archivos..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Primera pasada: reemplazar versión con guiones bajos
echo "  Paso 1/2: Reemplazando '${OLD_NAME}' por '${NEW_NAME}'..."
find . -type f -exec sed -i '' "s/${OLD_NAME}/${NEW_NAME}/g" {} +

# Segunda pasada: reemplazar versión con guiones
OLD_NAME_DASH=$(echo "${OLD_NAME}" | tr '_' '-')
NEW_NAME_DASH=$(echo "${NEW_NAME}" | tr '_' '-')
echo "  Paso 2/2: Reemplazando '${OLD_NAME_DASH}' por '${NEW_NAME_DASH}'..."
find . -type f -exec sed -i '' "s/${OLD_NAME_DASH}/${NEW_NAME_DASH}/g" {} +
```

**Nota sobre compatibilidad de `sed`**:
- En macOS, usar `sed -i ''` (con cadena vacía después de -i)
- En Linux, usar `sed -i` (sin argumento adicional)

Detectar el sistema operativo y ajustar el comando:

```bash
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  SED_INPLACE="sed -i ''"
else
  # Linux
  SED_INPLACE="sed -i"
fi
```

### Paso 6: Renombrar la carpeta del módulo/tema

**IMPORTANTE**: Este paso se ejecuta al final, después de renombrar archivos y contenido.

```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Renombrando carpeta del módulo/tema..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Subir un nivel para poder renombrar la carpeta actual
cd ..

# Obtener el nombre de la carpeta actual (que aún tiene el nombre antiguo)
CURRENT_DIR=$(basename "$TARGET_DIR")

# Si el nombre de la carpeta es diferente al nombre antiguo, usar ese nombre
if [ "$CURRENT_DIR" != "$OLD_NAME" ]; then
  OLD_DIR_NAME="$CURRENT_DIR"
else
  OLD_DIR_NAME="$OLD_NAME"
fi

# Renombrar la carpeta
if [ "$OLD_DIR_NAME" != "$NEW_NAME" ]; then
  echo "  $OLD_DIR_NAME/ → $NEW_NAME/"
  mv "$OLD_DIR_NAME" "$NEW_NAME"

  # Actualizar TARGET_DIR para reflejar el nuevo nombre
  TARGET_DIR=$(dirname "$TARGET_DIR")/"$NEW_NAME"

  # Entrar en la carpeta renombrada
  cd "$NEW_NAME"
else
  echo "  ✓ La carpeta ya tiene el nombre correcto"
  cd "$OLD_DIR_NAME"
fi
```

### Paso 7: Verificar resultado

```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Verificando resultado..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar que existe el nuevo .info.yml
if [ -f "${NEW_NAME}.info.yml" ]; then
  echo "  ✓ Archivo ${NEW_NAME}.info.yml encontrado"
else
  echo "  ✗ ERROR: No se encontró ${NEW_NAME}.info.yml"
fi

# Verificar que no quedan archivos con el nombre antiguo
OLD_FILES=$(find . -type f -name "*${OLD_NAME}*" | wc -l)
if [ "$OLD_FILES" -eq 0 ]; then
  echo "  ✓ No quedan archivos con el nombre antiguo"
else
  echo "  ⚠️  Advertencia: Aún existen $OLD_FILES archivo(s) con el nombre antiguo:"
  find . -type f -name "*${OLD_NAME}*"
fi

# Verificar que la carpeta tiene el nombre correcto
CURRENT_FOLDER=$(basename "$(pwd)")
if [ "$CURRENT_FOLDER" = "$NEW_NAME" ]; then
  echo "  ✓ La carpeta tiene el nombre correcto: $NEW_NAME/"
else
  echo "  ⚠️  Advertencia: La carpeta se llama '$CURRENT_FOLDER' en lugar de '$NEW_NAME'"
fi

# Buscar referencias al nombre antiguo en el contenido (muestra primeras 5)
echo ""
echo "  Buscando referencias al nombre antiguo en el contenido..."
REFS=$(grep -r "${OLD_NAME}" . --exclude-dir=.git 2>/dev/null | head -5)
if [ -z "$REFS" ]; then
  echo "  ✓ No se encontraron referencias al nombre antiguo"
else
  echo "  ⚠️  Se encontraron algunas referencias (primeras 5):"
  echo "$REFS" | sed 's/^/    /'
fi
```

### Paso 8: Mostrar resumen y siguientes pasos

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ¡Renombrado Completado!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Resumen de cambios:
   • Carpeta renombrada: {{OLD_DIR_NAME}}/ → {{NEW_NAME}}/
   • Archivos renombrados: {{OLD_NAME}}* → {{NEW_NAME}}*
   • Contenido actualizado en todos los archivos
   • Variantes procesadas: guiones bajos y guiones

📍 Nueva ubicación: {{TARGET_DIR}}

⚠️  Próximos pasos IMPORTANTES:

   1. Revisar los cambios:
      cd {{TARGET_DIR}}
      git status
      git diff

   2. Verificar que todo funciona correctamente:
      - Revisar archivos críticos (.info.yml, .module, etc.)
      - Ejecutar tests si los hay
      - Verificar que no hay errores de sintaxis

   3. Si todo está correcto, hacer commit:
      git add -A
      git commit -m "Renombrado de módulo/tema: {{OLD_NAME}} → {{NEW_NAME}}"

   4. Si es necesario deshacer los cambios:
      git checkout .
      git clean -fd

📌 Notas:
   • Si el módulo/tema estaba habilitado en Drupal, deberás:
     - Deshabilitarlo con el nombre antiguo (antes de hacer commit)
     - Hacer commit de los cambios
     - Limpiar caché: ddev drush cr
     - Habilitarlo con el nombre nuevo
     - Ejecutar actualización de base de datos: ddev drush updb

   • Si tienes referencias a este módulo/tema en:
     - Configuración exportada (config/sync/*.yml)
     - Otros módulos custom
     - Documentación
     Deberás actualizarlas manualmente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Manejo de Errores

- Si no se encuentra `.info.yml`, detener y mostrar mensaje claro
- Si los nombres son iguales, detener antes de realizar cambios
- Si `find` o `sed` fallan, capturar el error y reportarlo claramente
- Siempre verificar que los archivos renombrados existen antes de confirmar éxito

## Criterios de Éxito

Un renombrado exitoso incluye:
- ✓ La carpeta del módulo/tema renombrada de `{{OLD_NAME}}` a `{{NEW_NAME}}`
- ✓ Todos los archivos con `{{OLD_NAME}}` renombrados a `{{NEW_NAME}}`
- ✓ Contenido de archivos actualizado (ambas variantes: con guiones bajos y guiones)
- ✓ Archivo `{{NEW_NAME}}.info.yml` existe y es válido
- ✓ No quedan archivos con el nombre antiguo
- ✓ Mínimas o ninguna referencia al nombre antiguo en el contenido
- ✓ Usuario informado de la nueva ubicación y próximos pasos

## Notas Técnicas

### Sobre el uso de `sed`

El comando `sed` tiene diferencias entre macOS (BSD) y Linux (GNU):
- **macOS**: Requiere `sed -i ''` (argumento vacío obligatorio)
- **Linux**: Requiere `sed -i` (sin argumento adicional)

La skill debe detectar el sistema operativo y usar la sintaxis correcta.

### Sobre el uso de `find`

Para evitar problemas con nombres de archivos que contienen espacios o caracteres especiales:
- Usar `find ... -print0` con `read -r -d ''` cuando sea necesario
- Alternativamente, usar `find ... -exec` que maneja correctamente los espacios

### Limitaciones

Esta skill NO hace lo siguiente (el usuario debe hacerlo manualmente):
- No deshabilita/habilita el módulo en Drupal
- No ejecuta actualizaciones de base de datos
- No modifica configuración exportada de Drupal (`config/sync/*.yml`)
- No actualiza referencias en otros módulos que dependan de este
- No actualiza referencias en el directorio `vendor/` (generadas por Composer)
- No modifica archivos fuera del directorio del módulo/tema

### Consideraciones sobre el renombrado de carpetas

Cuando la skill renombra la carpeta del módulo/tema:
- Si ejecutaste desde la raíz del proyecto, la ruta completa cambia (ej. `web/modules/custom/old_name` → `web/modules/custom/new_name`)
- Si ejecutaste desde la carpeta del módulo/tema, solo cambia el nombre de esa carpeta
- Git detectará esto como un "rename" si no hay muchos cambios en el contenido de los archivos
- Si hay cambios significativos en el contenido, Git podría detectarlo como "delete + add"

---

## Seguridad

- **Confirmación obligatoria**: Siempre pedir confirmación antes de modificar archivos
- **Advertencia sobre git**: Informar si hay cambios sin commitear
- **Verificación post-cambio**: Siempre verificar el resultado y reportar anomalías
- **Instrucciones de rollback**: Proporcionar comandos para deshacer cambios si es necesario
