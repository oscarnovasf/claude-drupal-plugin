---
allowed-tools: Read, Edit, Write, Bash
argument-hint: [version] | [entry-type] [description]
description: Generar y mantener changelog del proyecto con formato Keep a Changelog
---

# Agregar Entrada al Changelog

Generar y mantener changelog del proyecto: $ARGUMENTS

## Estado Actual

- Changelog existente: @CHANGELOG.md (si existe)
- Commits recientes: !git log --oneline -10
- Estado de git: !git status --short
- Cambios sin commitear: !git diff --stat
- Cambios staged: !git diff --cached --stat
- Versión actual: !git describe --tags --abbrev=0 2>/dev/null || echo "No tags found"
- Versión del paquete: @package.json (si existe)
- README del proyecto: @README.md (si existe y contiene referencias a versión)

## Detección de Versión

1. **Si NO se proporciona versión en $ARGUMENTS**:
   - Leer CHANGELOG.md y extraer:
     - La última versión publicada
     - TODOS los cambios ya documentados (en todas las versiones)
     - Entradas en sección "Sin versión"
   - Analizar TODOS los cambios desde la última versión:
     - Commits recientes desde el último tag
     - Cambios sin commitear (working directory)
     - Cambios en staging area
   - **Filtrar cambios ya documentados**:
     - Comparar commits con entradas existentes en CHANGELOG
     - Solo considerar cambios NO documentados para la sugerencia de versión
     - Evitar duplicar entradas que ya están en el CHANGELOG
   - Sugerir la siguiente versión según semantic versioning basándose en cambios NO documentados:
     - **MAJOR** (X.0.0): Cambios incompatibles o breaking changes
     - **MINOR** (x.Y.0): Nueva funcionalidad compatible
     - **PATCH** (x.y.Z): Correcciones de bugs
   - Usar AskUserQuestion para confirmar versión sugerida o permitir especificar otra

2. **Si se proporciona versión en $ARGUMENTS**:
   - Usar la versión indicada directamente

## Actualización de README

1. **Verificar si README.md contiene referencias a versión**:
   - Buscar patrones como: `Version: X.Y.Z`, `v1.2.3`, badges de versión, etc.
   - Si se encuentran referencias a la versión anterior

2. **Confirmar actualización con el usuario**:
   - Usar AskUserQuestion para preguntar si desea actualizar el README.md
   - Mostrar las líneas específicas que serían actualizadas
   - Permitir al usuario decidir si actualizar o no

3. **Si el usuario acepta**:
   - Actualizar todas las referencias de versión en README.md
   - Mantener el formato original (si era `v1.0.0`, usar `v1.1.0`, no `1.1.0`)

## Gestión de Entradas

1. **Detección de cambios duplicados**:
   - Antes de agregar cualquier entrada, verificar si ya existe en el CHANGELOG
   - Comparar por contenido semántico, no solo texto exacto
   - Ejemplos de duplicados:
     - Commit: "feat: add dark mode" vs CHANGELOG: "Dark mode toggle"
     - Commit: "fix: login timeout" vs CHANGELOG: "Resolve login timeout issues"

2. **Solo agregar cambios nuevos**:
   - Listar claramente qué cambios están sin documentar
   - Proponer entradas solo para cambios NO documentados
   - Si todos los cambios ya están documentados, informar al usuario

3. **Manejo de sección "Sin versión"**:
   - Si existen entradas en "Sin versión", moverlas a la nueva versión
   - No duplicar estas entradas, solo moverlas

## Tarea

1. **Formato del Changelog**
   ```markdown
   # Histórico de cambios
   ---
   Todos los cambios notables de este proyecto se documentarán en este archivo.
   
   ## [Sin versión]
   ### Añadido
   - Nuevas funciones
   
   ### Cambios
   - Cambios en la funcionalidad existente
   
   ### Obsoleto
   - Funciones que pronto serán eliminadas
   
   ### Eliminado
   - Funciones eliminadas
   
   ### Errores
   - Corrección de errores
   
   ### Seguridad
   - Mejoras en la seguridad
   ```

2. **Entradas de Versión**
   ```markdown

   ---
   ## [v1.2.3] - 2024-01-15
   ### Añadido
   - Sistema de autenticación de usuarios
   - Alternar modo oscuro
   - Funcionalidad de exportación para informes
   
   ### Errores
   - Fuga de memoria en tareas en segundo plano
   - Problemas con el manejo de zonas horarias
   ```

3. **Integración con Releases**
   - Actualizar changelog antes de cada release
   - Incluir en notas de release
   - Vincular a GitHub releases
   - Etiquetar versiones de forma consistente

Recuerda mantener entradas claras, categorizadas y enfocadas en cambios visibles para el usuario.