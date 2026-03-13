---
name: config-ia
description: >
  Configura Claude Code para el proyecto actual - statusline, output-style y settings locales
  Trigger: Manual, mediante comando específico.
disable-model-invocation: true
---

# Skill de Configuración de Claude Code para el Proyecto

Estás configurando Claude Code para el proyecto actual, aplicando la configuración
personalizada de la organización: script de statusline, estilo de salida y settings locales.

## Capacidades

Esta skill te permite:
- **Configurar settings locales** - Aplicar `.claude/settings.local.json` con la configuración del proyecto
- **Instalar el script de statusline** - Copiar y activar el script de statusline en el proyecto

## Detección de Escenario

**PRIMER PASO OBLIGATORIO: Verificar que estamos en un proyecto válido**

```bash
pwd
```

Verificar que existe un `composer.json` en el directorio actual. Si NO existe → **DETENER**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  No se encontró composer.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Esta skill debe ejecutarse desde la raíz de un proyecto.
Verifica que estás en el directorio correcto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Flujo de Configuración

### Paso 1: Obtener ruta del proyecto

```bash
pwd
```

Guardar la ruta absoluta como `PROJECT_PATH`.

### Paso 2: Instalar script de statusline

Copiar `templates/scripts/statusline.sh` a `.claude/scripts/statusline.sh` del proyecto
(crear el directorio `.claude/scripts/` si no existe). Asignar permisos de ejecución:

```bash
chmod +x .claude/scripts/statusline.sh
```

### Paso 3: Instalar CLAUDE.md del proyecto

1. **Obtener `PROJECT_NAME`**: extraer del campo `name` en `.ddev/config.yaml`.
   Si no existe, usar el nombre del directorio actual (`basename $PWD`).

2. **Obtener `DRUPAL_VARIANT`**:
   - Leer `composer.json` y revisar las dependencias (`require`) para detectar distribuciones conocidas:
     - `drupal/commerce` → `"Commerce"`
     - `drupal/contenta_jsonapi` → `"Headless/Contenta"`
     - `drupal/lightning` → `"Lightning"`
     - `drupal/opigno_lms` → `"Opigno LMS"`
   - Si ninguna coincide, extraer la versión principal de `drupal/core-recommended` o `drupal/core`
     (ej. `^10.3.x-dev` → `"10"`, `^11.0` → `"11"`).
   - Si no se puede determinar, usar `"estándar"`.

3. **Comprobar si ya existe `CLAUDE.md`** en la raíz del proyecto:
   - **Si existe**: mostrar aviso y preguntar al usuario si desea sobreescribirlo.
     Si responde que no → **omitir este paso**.
   - **Si NO existe**: continuar.

4. Leer la plantilla `templates/CLAUDE.md`.

5. Reemplazar en el contenido:
   - `{{PROJECT_NAME}}` → valor obtenido en el punto 1
   - `{{DRUPAL_VARIANT}}` → valor obtenido en el punto 2

6. Escribir el resultado en `CLAUDE.md` en la raíz del proyecto.

### Paso 4: Aplicar settings locales

1. Leer la plantilla `templates/settings.onovas.json`.

2. Reemplazar el placeholder `{{PROJECT_PATH}}` con la ruta absoluta obtenida en el Paso 1.

3. Leer el archivo `.claude/settings.local.json`:
   - **Si NO existe**: usar `{}` como base.
   - **Si existe**: leer su contenido actual.

4. Mergear las claves de la plantilla procesada sobre el contenido actual de `.claude/settings.local.json`.
   - Las claves de la plantilla sobreescriben las existentes.
   - Las claves no presentes en la plantilla se conservan.

5. Escribir el resultado en `.claude/settings.local.json`.

### Paso 5: Informar del resultado

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ¡Configuración de Claude Code aplicada!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Cambios realizados:
   ✓ Script de statusline instalado en .claude/scripts/statusline.sh
   ✓ CLAUDE.md instalado en la raíz del proyecto
   ✓ Settings locales actualizados en .claude/settings.local.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Criterios de Éxito

Una configuración exitosa incluye:
- ✓ `.claude/scripts/statusline.sh` presente y con permisos de ejecución
- ✓ `CLAUDE.md` creado en la raíz del proyecto con `{{PROJECT_NAME}}` y `{{DRUPAL_VARIANT}}` sustituidos
- ✓ `.claude/settings.local.json` creado o actualizado con la configuración del proyecto
- ✓ El placeholder `{{PROJECT_PATH}}` sustituido por la ruta real del proyecto

## Plantillas

Los archivos de plantilla utilizados por esta skill:
- `templates/CLAUDE.md` - Guía de Claude para el proyecto (orquestador + flujo SDD)
- `templates/settings.onovas.json` - Configuración local de Claude Code para el proyecto
- `templates/scripts/statusline.sh` - Script de statusline para Claude Code
