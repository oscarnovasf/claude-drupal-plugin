---
name: config-ia
description: Configura Claude Code para el proyecto actual - statusline, output-style y settings locales
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

### Paso 3: Aplicar settings locales

1. Leer la plantilla `templates/settings.onovas.json`.

2. Reemplazar el placeholder `{{PROJECT_PATH}}` con la ruta absoluta obtenida en el Paso 1.

3. Leer el archivo `.claude/settings.local.json`:
   - **Si NO existe**: usar `{}` como base.
   - **Si existe**: leer su contenido actual.

4. Mergear las claves de la plantilla procesada sobre el contenido actual de `.claude/settings.local.json`.
   - Las claves de la plantilla sobreescriben las existentes.
   - Las claves no presentes en la plantilla se conservan.

5. Escribir el resultado en `.claude/settings.local.json`.

### Paso 4: Informar del resultado

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ¡Configuración de Claude Code aplicada!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Cambios realizados:
   ✓ Script de statusline instalado en .claude/scripts/statusline.sh
   ✓ Settings locales actualizados en .claude/settings.local.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Criterios de Éxito

Una configuración exitosa incluye:
- ✓ `.claude/scripts/statusline.sh` presente y con permisos de ejecución
- ✓ `.claude/settings.local.json` creado o actualizado con la configuración del proyecto
- ✓ El placeholder `{{PROJECT_PATH}}` sustituido por la ruta real del proyecto

## Plantillas

Los archivos de plantilla utilizados por esta skill:
- `templates/settings.onovas.json` - Configuración local de Claude Code para el proyecto
- `templates/scripts/statusline.sh` - Script de statusline para Claude Code
