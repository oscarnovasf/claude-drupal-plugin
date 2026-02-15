# Histórico de cambios
---
Todos los cambios notables de este proyecto se documentarán en este archivo.

## [Sin versión]
> Ver TODO.md

---
## [v1.1.0] - 2026-02-15
> Refactorización de arquitectura: sistema modular de 3 plugins independientes.

### Cambios
- **BREAKING CHANGE**: Directorio `shared/` renombrado a `drupal-global/`
  - `shared/` ya no existe, todos los componentes movidos a `drupal-global/`
  - Los usuarios deben desinstalar versiones anteriores antes de actualizar
- Refactorizada arquitectura del marketplace con 3 plugins completamente separados:
  - `drupal-global`: Plugin base con MCPs y componentes compartidos
  - `drupal-backend`: Plugin especializado backend (requiere drupal-global)
  - `drupal-frontend`: Plugin especializado frontend (requiere drupal-global)
- Eliminada duplicación de MCPs: ahora solo se registran en `drupal-global`
- Los plugins `drupal-backend` y `drupal-frontend` ya no incluyen `mcpServers`
- Actualizada versión del marketplace y todos los plugins a v1.1.0

### Añadido
- Nuevo plugin `drupal-global` (anteriormente componentes en `shared/`)
- Sección técnica en README sobre dependencias entre plugins
- Documentación del workaround actual para dependencias (issue #9444)
- Nota sobre instalación secuencial de plugins (drupal-global primero)
- Referencia a GitHub issue sobre sistema de dependencias futuro
- Plan de migración cuando se implemente campo `dependencies` nativo

### Documentación
- Actualizada arquitectura modular en README.md
- Nuevas instrucciones de instalación con 4 opciones (A/B/C/D)
- Diagrama actualizado mostrando los 3 plugins independientes
- Explicación detallada de ventajas de la arquitectura modular
- Sección "Nota técnica sobre dependencias" con estado actual y futuro

---
## [v1.0.1] - 2026-02-15
> Mejoras en documentación y skill de configuración.

### Cambios
- Actualizada documentación de instalación con instrucciones más claras

---
## [v1.0.0] - 2026-02-15
> Lanzamiento inicial de los plugins de Claude Code para desarrollo con Drupal.

### Añadido

#### Arquitectura del Marketplace
- Sistema de marketplace `drupal-tools` con dos plugins especializados
- Plugin `drupal-backend` v1.0.0 para desarrollo backend
- Plugin `drupal-frontend` v1.0.0 para desarrollo frontend
- Directorio `shared/` con componentes comunes heredados por ambos plugins
- Configuración `strict: false` para herencia automática de componentes
- Soporte para múltiples scopes de instalación (user, project, local)

#### Componentes Compartidos (shared/)
- **MCPs** (Model Context Protocol):
  - Context7: Documentación actualizada de librerías con soporte para API key opcional
  - Obsidian: Integración con vaults de Obsidian mediante `OBSIDIAN_VAULT_PATH`
  - Playwright: Automatización de navegador sin configuración adicional
- **Agente especializado**:
  - `context7`: Consulta documentación actualizada, verifica APIs, versiones y buenas prácticas
- **Comandos**:
  - `/drupal-setup`: Configuración de entornos de proyecto Drupal con detección automática de escenario
  - `/update-changelog`: Gestión de CHANGELOG.md con formato Keep a Changelog, semantic versioning y detección de duplicados
- **Skills**:
  - `drupal-setup`: Ciclo completo de desarrollo Drupal con plantillas de CLAUDE.md y README.md, instalación con DDEV
  - `change-name`: Renombrado completo de módulos/temas con soporte para snake_case y kebab-case
- **Hooks de protección base**:
  - Script `protect-files.sh` con patrones configurables
  - Protección de `node_modules/`, `vendor/` y `.git/`

#### Plugin drupal-backend
- **Agente especializado**:
  - `drupal-backend`: Experto en módulos custom, plugins, servicios, Entity API, migraciones, configuración y seguridad
- **Hooks adicionales**:
  - Script `protect-files.sh` específico para backend
  - Protección de núcleo de Drupal (`core/*`)
  - Protección de archivos de configuración (`default.settings.php`, `default.services.yml`)

#### Plugin drupal-frontend
- **Agente especializado**:
  - `drupal-frontend`: Experto en theming, Twig, CSS/JS, SDC, accesibilidad WCAG 2.1 AA, responsive design y Core Web Vitals
- **Comando**:
  - `/component`: Generador de Single Directory Components (SDC) con template, estilos y schema
- **Hooks adicionales**:
  - Script `protect-files.sh` específico para frontend
  - Protección de núcleo de Drupal (`core/*`)
  - Protección de archivos compilados (`dist/*`, `build/*`)

#### Documentación Completa
- README.md con:
  - Explicación de arquitectura de plugins de Claude Code (agentes, comandos, skills, hooks, MCPs)
  - Estructura de directorios completa con ejemplos
  - Diagrama visual de herencia de componentes
  - Guía de instalación paso a paso con GitHub
  - Configuración de variables de entorno (Context7, Obsidian)
  - Sistema de permisos por scope (usuario, proyecto, local)
  - Explicación del mecanismo de herencia sin sistema nativo de dependencias
  - Sección de preguntas frecuentes
  - Comandos de validación y prueba local
- Badges de versión (v1.0.0), licencia GPLv3+, código de conducta 2.0 y donación PayPal
- Enlaces a recursos: LICENSE.md, CODE_OF_CONDUCT.md, CHANGELOG.md

#### Configuración del Proyecto
- `.gitignore` completo
- Configuración de VSCode (`.vscode/`):
  - `extensions.json`: Extensiones recomendadas
  - `settings.json`: Configuración del editor
  - `cspell.json`: Diccionario español e inglés
  - `tasks.json`: Tareas de validación de plugins
  - `launch.json`: Configuraciones de debugging
- `TODO.md` para seguimiento de tareas pendientes
- Archivos JSON de configuración de plugins:
  - `marketplace.json`: Definición del marketplace drupal-tools
  - `plugin.json` para drupal-backend y drupal-frontend
  - `hooks.json` en shared/, drupal-backend/ y drupal-frontend/
  - `.mcp.json` con configuración de MCPs