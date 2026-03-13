---
name: drupal-setup
description: Ciclo de vida completo de desarrollo Drupal - configuración, incorporación y mantenimiento
disable-model-invocation: true
---

# Skill de Configuración y Desarrollo de Proyectos Drupal

Estás ayudando con la configuración de proyectos Drupal y el desarrollo continuo
con buenas prácticas y estándares organizacionales.

## Capacidades

Esta skill te permite:
- **Configurar proyectos Drupal EXISTENTES** - Incorporación a proyectos Drupal existentes
- **Mantener y actualizar** - Mantener el entorno local sincronizado con los cambios del equipo
- Configurar con buenas prácticas organizacionales

## Detección de Escenario

**PRIMER PASO OBLIGATORIO: Detectar el escenario actual**

Seguir este flujo de decisión en orden:

### 1. Verificar existencia de composer.json

```bash
test -f "composer.json"
```

**Si NO existe `composer.json`** → **DETENER**. Informar al usuario:

> No se ha encontrado un archivo `composer.json` en el directorio actual.
> Esta skill requiere un proyecto Drupal existente.
> Verifica que estás en el directorio correcto del proyecto.

No proceder con ninguna acción.

### 2. Verificar que es un proyecto Drupal

```bash
grep -q "drupal" composer.json
```

**Si `composer.json` NO contiene dependencias de Drupal** → **DETENER**. Informar al usuario:

> El directorio actual contiene un proyecto Composer, pero no parece ser un proyecto Drupal.
> Esta skill está diseñada exclusivamente para proyectos Drupal.
> Verifica que estás en el directorio correcto.

No proceder con ninguna acción.

### 3. Proyecto Drupal detectado → Continuar

Si se llega a este punto, estamos en un proyecto Drupal válido.
Continuar al flujo de interacción con el usuario.

## Flujo de Interacción con el Usuario

**Detectado: Proyecto Drupal existente (composer.json con dependencias de Drupal)**

Usar la herramienta `AskUserQuestion` para preguntar al usuario qué desea hacer:

- **Opción 1: Configuración inicial** - Primera vez trabajando en este proyecto
- **Opción 2: Reiniciar entorno local** - Instalación limpia del entorno

Según la opción seleccionada, seguir el flujo correspondiente a continuación.

---

## Flujo: Configuración de Proyecto Existente (Inicial)

**Caso de uso**: Primera vez trabajando en un proyecto Drupal existente.

**IMPORTANTE**: Este flujo requiere pasos manuales para la autenticación. NO intentes ejecutar `ddev config` ni `ddev start` automáticamente.

### Paso 1: Verificar y aplicar documentación del proyecto

Ejecutar la verificación de README.md (ver sección "Verificación de README.md" más abajo).

### Paso 2: Detectar configuración DDEV y mostrar pasos manuales

Verificar si ya existe `.ddev/config.yaml`:
- **Si existe**: Extraer el nombre del proyecto del campo `name` para usarlo en los pasos siguientes.
- **Si NO existe**:
  - Detectar el nombre del proyecto desde el directorio actual.
  - Detectarla versión de PHP requerida desde `composer.json` (campo `require.php`).
  - Detectar la versión de Drupal desde `composer.json` (campo `require.drupal/core` → "Obtener sólo versión mayor").
  - Sugerir el comando `ddev config` adecuado.

Mostrar al usuario:

```
Plan de Configuración del Proyecto Drupal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PASOS MANUALES (tú):
   [ ] 1. Configurar DDEV (si no está configurado)
   [ ] 2. Iniciar DDEV

🤖 PASOS AUTOMATIZADOS (yo):
   [ ] 3. Verificar estructura del proyecto
   [ ] 4. Instalar dependencias de Composer (~2-3 min)
   [ ] 5. Instalar Drupal
   [ ] 6. Exportar configuración (si es necesario)
   [ ] 7. Proporcionar datos de acceso

Tiempo estimado: ~5 minutos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────┐
│ PASOS MANUALES REQUERIDOS (se necesita autenticación)       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Por favor ejecuta estos comandos:                           │
│                                                             │
│ 1. Configurar DDEV (si no existe .ddev/config.yaml):          │
│    ddev config                                               │
│    ddev add-on get oscarnovasf/ddev-commands                │
│                                                             │
│ 2. Iniciar DDEV:                                            │
│    ddev start                                               │
│                                                             │
│ Escribe 'listo' cuando hayas terminado                      │
└─────────────────────────────────────────────────────────────┘

Comando de configuración sugerido:
ddev config --project-name=<nombre> --project-type=<version> --docroot=web --php-version=<php_version>
```

**Nota**: Adaptar el comando `ddev config` sugerido con los datos reales del proyecto:
- `--project-name`: nombre del directorio del proyecto (en minúsculas, sin espacios)
- `--php-version`: versión detectada de `composer.json` (ej. si `require.php` es `>=8.3`, usar `8.3`)
- `--project-type`: usar `drupal11`, `drupal10`,... según la versión detectada de Drupal
- Si ya existe `.ddev/config.yaml`, ajustar el paso 1 para que solo muestre el comando `ddev add-on get oscarnovasf/ddev-commands` y omita la configuración inicial.

### Paso 3: Esperar confirmación del usuario

Esperar a que el usuario escriba 'listo' antes de continuar.

### Paso 4: Verificar que DDEV está ejecutándose

```bash
ddev describe
```

Si esto falla, indicar al usuario que ejecute `ddev start` de nuevo.

### Paso 5: Verificar estructura del proyecto

```bash
ls -la composer.json .ddev/config.yaml config/sync
```

### Paso 6: Instalar dependencias

```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Instalando dependencias de Composer (~2-3 minutos)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ddev composer install
```

### Paso 7: Instalar Drupal (con detección de volcado de BD y config)

```bash
# Buscar volcado de base de datos (.sql, .sql.gz, .sql.zip, .sql.bz2)
DB_DUMP=$(find . -maxdepth 1 -type f \( -name "*.sql" -o -name "*.sql.gz" -o -name "*.sql.zip" -o -name "*.sql.bz2" \) | head -1)

if [ -n "$DB_DUMP" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✓ Volcado de base de datos encontrado: $DB_DUMP"
  echo "🔧 Importando base de datos..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  ddev import-db --file="$DB_DUMP"
  ddev drush cache:rebuild
elif [ -f "config/sync/core.extension.yml" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✓ Configuración existente encontrada"
  echo "🔧 Instalando Drupal desde la configuración existente..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  ddev drush site:install --existing-config --account-pass=admin -y
else
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "ℹ No se encontró volcado de BD ni configuración - realizando instalación limpia"
  echo "🔧 Instalando Drupal..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  ddev drush site:install --account-pass=admin -y
  ddev drush config:export -y
  echo "Nota: Configuración inicial exportada. Considera hacer commit del directorio config/sync/."
fi
```

### Paso 8: Limpiar caché y obtener detalles del sitio

```bash
ddev drush cache:rebuild

# Obtener la URL del sitio
SITE_URL=$(ddev describe | grep -oP 'https://[^ ]+' | head -1)

# Obtener enlace de inicio de sesión único
ULI=$(ddev drush uli)
```

### Paso 9: Informar del éxito

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ¡Configuración Completada!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 Tu Sitio:
   URL: <SITE_URL>
   Inicio de sesión único: <ULI>

📝 Próximos Pasos:

   Flujo de trabajo de desarrollo:
   • Realizar cambios en la interfaz de Drupal
   • Exportar config: ddev drush cex -y
   • Hacer commit: git add -A && git commit -m "mensaje"
   • Hacer push (si procede): git push

   Comandos comunes:
   • ddev drush uli           # Inicio de sesión único
   • ddev drush cr            # Limpiar caché
   • ddev launch              # Abrir en navegador
   • ddev drush watchdog:show # Ver registros
   • ddev drush status        # Verificar estado de Drupal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Flujo: Reiniciar Entorno Local

**Caso de uso**: Empezar desde cero - reinstalar Drupal con la configuración actual.

### Paso 1: Verificar y aplicar documentación del proyecto

Ejecutar la verificación de README.md (ver sección "Verificación de README.md" más abajo).

### Paso 2: Detener y eliminar base de datos

```bash
ddev stop
ddev delete -y
```

### Paso 3: Reiniciar DDEV

```bash
ddev start
```

### Paso 4: Instalar dependencias

```bash
ddev composer install
```

### Paso 5: Reinstalar Drupal (con detección de volcado de BD y config)

```bash
# Buscar volcado de base de datos (.sql, .sql.gz, .sql.zip, .sql.bz2)
DB_DUMP=$(find . -maxdepth 1 -type f \( -name "*.sql" -o -name "*.sql.gz" -o -name "*.sql.zip" -o -name "*.sql.bz2" \) | head -1)

if [ -n "$DB_DUMP" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✓ Volcado de base de datos encontrado: $DB_DUMP"
  echo "🔧 Importando base de datos..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  ddev import-db --file="$DB_DUMP"
  ddev drush cache:rebuild
elif [ -f "config/sync/core.extension.yml" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✓ Configuración existente encontrada"
  echo "🔧 Reinstalando Drupal desde la configuración existente..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  ddev drush site:install --existing-config --account-pass=admin -y
else
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "ℹ No se encontró volcado de BD ni configuración - realizando instalación limpia"
  echo "🔧 Instalando Drupal..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  ddev drush site:install --account-pass=admin -y
  ddev drush config:export -y
  echo "Nota: Configuración inicial exportada. Considera hacer commit del directorio config/sync/."
fi
```

### Paso 6: Limpiar caché y obtener detalles del sitio

```bash
ddev drush cache:rebuild

# Obtener la URL del sitio
SITE_URL=$(ddev describe | grep -oP 'https://[^ ]+' | head -1)

# Obtener enlace de inicio de sesión único
ULI=$(ddev drush uli)
```

### Paso 7: Informar del éxito

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ¡Reinicio del Entorno Completado!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 Tu Sitio:
   URL: <SITE_URL>
   Inicio de sesión único: <ULI>

📝 Próximos Pasos:

   • ddev launch             # Abrir en navegador
   • ddev drush uli          # Obtener nuevo inicio de sesión único
   • ddev drush status       # Verificar estado de Drupal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Verificación de README.md

**Este paso se ejecuta al inicio de ambos flujos (Configuración Inicial y Reinicio).**

Verificar el estado de `README.md` en el proyecto:

### Caso 1: No existe README.md

1. Reutilizar los valores de placeholders ya detectados en la verificación de CLAUDE.md
   (`{{PROJECT_NAME}}`, `{{DRUPAL_VARIANT}}`).
2. Leer la plantilla `templates/README.md`.
3. Reemplazar los placeholders con los valores detectados.
4. **Validar y ajustar el contenido contra la realidad del proyecto**:
   - **Estructura del Proyecto**: Examinar el árbol de directorios real y actualizar la sección
     `Estructura del Proyecto` del README para que refleje únicamente los directorios y archivos que existen. Eliminar
     entradas que no existan y añadir las que falten (ej. si hay un directorio `scripts/`, `patches/`, `.github/`, etc.).
   - **Inicio Rápido**: Verificar si el proyecto usa `--existing-config` (existe `config/sync/core.extension.yml`) o
     instalación limpia y ajustar el comando de instalación acorde.
   - **Calidad de Código**: Detectar las herramientas de calidad reales del proyecto (phpcs, phpstan, phpunit) y sus
     configuraciones. Ajustar los comandos a los que realmente aplican (ej. si existe `phpcs.xml.dist` usar
     `ddev exec phpcs` sin `--standard`, si hay comandos DDEV personalizados como `ddev phpstan` usar esos en lugar
     de los genéricos).
   - **Módulos y temas custom**: Si existen módulos custom en `web/modules/custom/` o temas en `web/themes/custom/`,
     añadir una sección que los liste brevemente.
5. Crear el archivo `README.md` en la raíz del proyecto.
6. Informar al usuario: "Se ha creado README.md con la documentación del proyecto ajustada a su estructura real."

### Caso 2: Ya existe README.md

Usar `AskUserQuestion` para preguntar al usuario:
- **Reemplazar**: Sobreescribir el README.md actual con la plantilla de la skill (se ajustará al proyecto real).
- **Mantener**: Conservar el README.md actual sin modificaciones.

Si el usuario elige reemplazar, proceder como en el Caso 1.

---

## Plantillas

Todos los archivos de plantilla se encuentran en el subdirectorio `templates/`:
- `settings.php` - Configuración de Drupal específica de la organización
- `gitignore` - .gitignore completo para Drupal
- `ddev-config.yaml` - Plantilla de configuración DDEV
- `README.md` - Plantilla de documentación del proyecto

Al usar plantillas:
1. Leer el archivo de plantilla
2. Reemplazar los marcadores de posición:
   - `{{PROJECT_NAME}}` - Reemplazar con el nombre real del proyecto
   - `{{DRUPAL_VARIANT}}` - Reemplazar con la variante seleccionada
3. Escribir la plantilla procesada en la ubicación destino

## Manejo de Errores

- Si Composer falla, verificar la conectividad de red y reintentar
- Si el push de Git falla, usar reintento con backoff exponencial (hasta 4 veces)
- Si los comandos drush fallan, proporcionar mensajes de error claros y sugerir soluciones

## Criterios de Éxito

Una configuración exitosa incluye:
- ✓ Todos los archivos creados sin errores
- ✓ Dependencias de Composer instaladas
- ✓ Archivos de configuración correctamente estructurados
- ✓ README.md presente en el proyecto
- ✓ Documentación completa y precisa
- ✓ (Si instalación completa) Drupal instalado y configuración inicial exportada

## Guía Post-Configuración

Después de la configuración, informar al usuario:
- Cómo acceder a su sitio (si fue instalación completa)
- Próximos pasos para el desarrollo
- Cómo trabajar con la gestión de configuración
- Comandos drush comunes (referencia CLAUDE.md)

## Notas

- Esta skill crea proyectos listos para producción, no demos rápidos
- Todas las configuraciones siguen las buenas prácticas organizacionales de CurrentWorkflow.md
- Enfoque config-first: los cambios deben hacerse mediante archivos de config cuando sea posible
- La configuración DDEV se incluye incluso en instalaciones completas (para colaboración en equipo)
