drupal-tools
===

>Plugins de Claude Code para desarrollo con Drupal

[![version][version-badge]][changelog]
[![Licencia][license-badge]][license]
[![Código de conducta][conduct-badge]][conduct]
[![Donate][donate-badge]][donate-url]

---

## Descripción

Colección de plugins para Claude Code orientados al desarrollo con Drupal.
El marketplace ofrece dos plugins especializados que comparten una base común
de componentes:

| Plugin | Descripción |
|--------|-------------|
| **drupal-backend** | Especializado en backend: módulos, APIs, servicios, migraciones |
| **drupal-frontend** | Especializado en frontend: theming, Twig, CSS/JS, accesibilidad |

Ambos plugins incluyen automáticamente los componentes compartidos (MCPs,
agentes, comandos y hooks) del directorio `shared/`.

---

## Arquitectura

### Componentes de un plugin

Los plugins de Claude Code pueden incluir los siguientes tipos de componentes:

| Componente | Qué es | Ejemplo |
|------------|--------|---------|
| **Agentes** | Subagentes especializados que Claude invoca automáticamente según el contexto de la tarea. Tienen su propio prompt de sistema, herramientas y modelo. | El agente `context7` consulta documentación actualizada antes de responder. |
| **Comandos** | Atajos invocables con `/nombre` que ejecutan instrucciones predefinidas. Útiles para tareas repetitivas o flujos guiados. | `/drupal-setup` configura un entorno de proyecto Drupal. |
| **Skills** | Similares a los comandos pero con estructura más completa: pueden incluir archivos de referencia, scripts auxiliares y subdirectorios. | La skill `drupal-setup` incluye plantillas de CLAUDE.md y README.md. |
| **Hooks** | Scripts que se ejecutan automáticamente antes o después de que Claude use una herramienta. Actúan como guardrails de seguridad. | Un hook `PreToolUse` que impide modificar archivos en `vendor/`. |
| **MCPs** | Servidores del Model Context Protocol que conectan a Claude con herramientas externas (APIs, bases de datos, navegadores, etc.). | Context7 para documentación, Playwright para automatizar un navegador. |

### Estructura de directorios

```
drupal-tools/
├── .claude-plugin/
│   └── marketplace.json            # Registro de los 2 plugins
├── shared/                         # Componentes compartidos (no es un plugin)
│   ├── .mcp.json                   # MCPs: Context7, Obsidian, Playwright
│   ├── agents/
│   │   └── context7.md             # Agente experto en documentación
│   ├── commands/
│   │   ├── drupal-setup.md         # Comando para invocar la skill drupal-setup
│   │   └── update-changelog.md     # Comando para gestionar CHANGELOG.md
│   ├── skills/
│   │   ├── drupal-setup/           # Skill de configuración de proyectos Drupal
│   │   │   ├── SKILL.md            # Instrucciones de la skill
│   │   │   └── templates/          # Plantillas (CLAUDE.md, README.md)
│   │   └── change-name/            # Skill de renombrado de módulos/temas
│   │       └── SKILL.md            # Instrucciones de la skill
│   └── hooks/
│       ├── hooks.json              # Configuración de hooks compartidos
│       └── scripts/
│           └── protect-files.sh     # Protección: node_modules, vendor, .git
├── drupal-backend/                 # Plugin backend
│   ├── .claude-plugin/plugin.json
│   ├── agents/
│   │   └── drupal-backend.md       # Agente experto en backend Drupal
│   ├── commands/
│   │   └── migration.md            # Generador de migraciones
│   ├── skills/
│   └── hooks/
│       ├── hooks.json              # Configuración de hooks backend
│       └── scripts/
│           └── protect-files.sh     # Protección: core, default.settings.php
└── drupal-frontend/                # Plugin frontend
    ├── .claude-plugin/plugin.json
    ├── agents/
    │   └── drupal-frontend.md      # Agente experto en frontend Drupal
    ├── commands/
    │   └── component.md            # Generador de SDC (Single Directory Components)
    ├── skills/
    └── hooks/
        ├── hooks.json              # Configuración de hooks frontend
        └── scripts/
            └── protect-files.sh     # Protección: core, dist, build
```

### Herencia de componentes

Los plugins `drupal-backend` y `drupal-frontend` **incluyen automáticamente**
todos los componentes de `shared/` gracias a la configuración `strict: false`
en el marketplace. Al instalar cualquiera de los dos plugins obtienes:

- Todos los **agentes** de shared + los propios del plugin
- Todos los **comandos** de shared + los propios del plugin
- Todos los **skills** de shared + los propios del plugin
- Todos los **hooks** de shared + los propios del plugin
- Todos los **MCPs** de shared (Context7, Obsidian, Playwright)

```
┌─────────────────────────────────────────────────┐
│              shared/ (no es plugin)             │
│  MCPs: Context7, Obsidian, Playwright           │
│  Agents: context7                               │
│  Commands: drupal-setup, update-changelog       │
│  Skills: drupal-setup, change-name              │
│  Hooks: protección base                         │
├────────────────────┬────────────────────────────┤
│   drupal-backend   │     drupal-frontend        │
│  + drupal-backend  │  + drupal-frontend agent   │
│    agent           │  + theme-scaffold cmd      │
│  + module-scaffold │  + component cmd           │
│    cmd             │  + hooks frontend          │
│  + migration cmd   │                            │
│  + hooks backend   │                            │
└────────────────────┴────────────────────────────┘
```

---

## Requisitos

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) instalado.
- [Node.js](https://nodejs.org/) >= 18 (necesario para los servidores MCP).

---

## Instalación

### 1. Añadir el marketplace

```bash
claude plugin marketplace add https://github.com/oscarnovasf/claude-drupal-plugin.git
```

### 2. Instalar el plugin que necesites

```bash
# Backend
claude plugin install drupal-backend@drupal-tools

# Frontend
claude plugin install drupal-frontend@drupal-tools

# Ambos (para full-stack)
claude plugin install drupal-backend@drupal-tools
claude plugin install drupal-frontend@drupal-tools
```

### 3. Scopes de instalación

Puedes elegir dónde instalar cada plugin:

```bash
# Personal (disponible en todos tus proyectos) - por defecto
claude plugin install drupal-backend@drupal-tools --scope user

# Proyecto (compartido con el equipo via git)
claude plugin install drupal-backend@drupal-tools --scope project

# Local (solo este proyecto, no se versiona)
claude plugin install drupal-backend@drupal-tools --scope local
```

### 4. Actualizar el plugin

Para actualizar a la última versión publicada:

```bash
# Actualizar un plugin específico
claude plugin update drupal-backend@drupal-tools
claude plugin update drupal-frontend@drupal-tools

# Actualizar todos los plugins
claude plugin update --all
```

> **Nota**: El comando `update` descarga e instala la versión más reciente desde el marketplace. Si has modificado el plugin localmente, esos cambios se perderán. Para desarrollo activo del plugin, consulta la sección [Desarrollo](#desarrollo).

---

## Componentes compartidos (shared/)

El directorio `shared/` no es un plugin instalable. Es un directorio de
recursos comunes que ambos plugins heredan automáticamente.

### MCPs incluidos

| MCP | Descripción | Configuración |
|-----|-------------|---------------|
| **Context7** | Documentación actualizada de librerías | API key opcional |
| **Obsidian** | Integración con vault de Obsidian | Requiere `OBSIDIAN_VAULT_PATH` |
| **Playwright** | Automatización de navegador | Ninguna |

### Agentes compartidos

| Agente | Descripción |
|--------|-------------|
| **context7** | Experto en documentación actualizada de librerías. Usa Context7 para verificar APIs, versiones y buenas prácticas antes de responder. |

### Comandos compartidos

| Comando | Descripción |
|---------|-------------|
| **/drupal-setup** | Configurar, incorporar o reiniciar un entorno de proyecto Drupal. Detecta el escenario y guía el flujo apropiado. |
| **/update-changelog** | Generar y mantener CHANGELOG.md con formato Keep a Changelog. Detecta versión automáticamente, sugiere siguiente versión según semantic versioning, evita duplicados y puede actualizar README.md. |

### Skills compartidos

| Skill | Descripción |
|-------|-------------|
| **drupal-setup** | Ciclo de vida completo de desarrollo Drupal: detección de escenario, configuración de entorno, generación de CLAUDE.md y README.md adaptados al proyecto, instalación de Drupal con DDEV. Incluye plantillas en `templates/`. |
| **change-name** | Renombra completamente un módulo o tema de Drupal. Puede ejecutarse desde la raíz del proyecto (busca y selecciona módulos/temas custom) o desde la carpeta del módulo/tema. Actualiza nombres de archivos, contenido interno y renombra la carpeta del proyecto. Maneja ambas variantes (snake_case y kebab-case). |

### Hooks de protección base

La lógica de protección está en `shared/hooks/scripts/protect-files.sh`.
Archivos protegidos contra modificación:
- `*/node_modules/*`
- `*/vendor/*`
- `*/.git/*`

Para añadir o quitar patrones, edita directamente el array
`PROTECTED_PATTERNS` dentro del script.

---

## Plugins

### drupal-backend

Plugin especializado en desarrollo backend.

#### Agentes

| Agente | Descripción |
|--------|-------------|
| **drupal-backend** | Experto en backend Drupal: módulos custom, plugins, servicios, Entity API, migraciones, configuración y seguridad. |

#### Comandos

| Comando | Descripción |
|---------|-------------|
| **/module-scaffold** | Genera la estructura completa de un módulo custom con todos los archivos boilerplate. |
| **/migration** | Genera configuración de migración y plugins para importar contenido desde fuentes externas. |

#### Hooks de protección adicionales

Script: `drupal-backend/hooks/scripts/protect-files.sh`. Además de los hooks
compartidos, protege:
- `*/core/*` (núcleo de Drupal)
- `*/sites/default/default.settings.php`
- `*/sites/default/default.services.yml`

---

### drupal-frontend

Plugin especializado en desarrollo frontend.

#### Agentes

| Agente | Descripción |
|--------|-------------|
| **drupal-frontend** | Experto en frontend Drupal: theming, Twig, CSS/JS, SDC, accesibilidad WCAG 2.1 AA, responsive design y Core Web Vitals. |

#### Comandos

| Comando | Descripción |
|---------|-------------|
| **/theme-scaffold** | Genera la estructura completa de un tema custom con templates, CSS, JS y breakpoints. |
| **/component** | Genera un Single Directory Component (SDC) con template, estilos y schema. |

#### Hooks de protección adicionales

Script: `drupal-frontend/hooks/scripts/protect-files.sh`. Además de los hooks
compartidos, protege:
- `*/core/*` (núcleo de Drupal)
- `*/dist/*` (archivos compilados)
- `*/build/*` (archivos de build)

---

## Configuración

### Variables de entorno

Los MCPs compartidos pueden requerir configuración adicional.

#### Context7 (opcional)

Context7 funciona sin API key (con límites de rate). Para obtener cuota
adicional, genera tu key en [context7.com](https://context7.com) y añade la
siguiente variable a tu `~/.zshrc` o `~/.zshenv`:

```bash
export CONTEXT7_API_KEY="tu-api-key-aquí"
```

#### Obsidian (opcional)

El MCP de Obsidian necesita la ruta a tu vault. Añade la siguiente variable a tu
`~/.zshrc` o `~/.zshenv`:

```bash
export OBSIDIAN_VAULT_PATH="/ruta/a/tu/vault/de/Obsidian"
```

Ejemplo en macOS con iCloud:

```bash
export OBSIDIAN_VAULT_PATH="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/MiVault"
```

### Permisos

Los permisos se configuran a nivel de proyecto o usuario, no de plugin.
Claude Code pedirá confirmación la primera vez que un MCP intente ejecutarse.
Para pre-autorizar herramientas, configura los permisos en el scope que
prefieras:

```json
{
  "permissions": {
    "allow": [
      "mcp__context7",
      "mcp__playwright",
      "mcp__obsidian__*"
    ],
    "deny": []
  }
}
```

| Scope | Archivo | Uso |
|-------|---------|-----|
| Usuario | `~/.claude/settings.json` | Permisos globales en todos tus proyectos |
| Proyecto | `.claude/settings.json` | Compartidos con el equipo (versionados en git) |
| Local | `.claude/settings.local.json` | Solo para ti en este proyecto (gitignored) |

> **Nota**: Estos archivos de settings son del proyecto donde usas Claude Code,
> no del marketplace. Cada proyecto Drupal donde trabajes puede tener su propia
> configuración de permisos.

---

## Cómo funciona la herencia

Claude Code **no tiene un sistema nativo de dependencias** entre plugins. La
herencia de componentes compartidos se consigue mediante dos mecanismos:

1. El `source` de ambos plugins apunta a la **raíz del marketplace** (`"./"`),
   no a su propio directorio. Así, al instalar un plugin se copia todo el
   repositorio (incluyendo `shared/`) al caché de Claude Code.
2. Con `strict: false`, el marketplace define **completamente** los componentes
   del plugin. Los arrays de `commands`, `agents`, `skills` y `hooks` listan
   rutas de `shared/` junto con las del propio plugin.

El resultado es que `shared/` actúa como una librería interna de componentes
que ambos plugins consumen, sin ser un plugin instalable por separado.

---

## Preguntas frecuentes

### ¿Qué pasa con los MCPs si no configuro las variables de entorno?

- **Context7**: Funciona sin API key, con límites de rate.
- **Obsidian**: No se iniciará si `OBSIDIAN_VAULT_PATH` no está definida. El
  resto del plugin funciona con normalidad.
- **Playwright**: Funciona sin configuración adicional.

---

## Desarrollo

### Validar el marketplace

```bash
claude plugin validate .
```

### Probar localmente

```bash
claude plugin marketplace add ./
claude plugin install drupal-backend@drupal-tools
```

---
⌨️ con ❤️ por [Óscar Novás][mi-web] 😊

[mi-web]: https://oscarnovas.com "for developers"

[version]: v1.0.0
[version-badge]: https://img.shields.io/badge/Versión-1.0.0-blue.svg

[license]: LICENSE.md
[license-badge]: https://img.shields.io/badge/Licencia-GPLv3+-green.svg "Leer la licencia"

[conduct]: CODE_OF_CONDUCT.md
[conduct-badge]: https://img.shields.io/badge/C%C3%B3digo%20de%20Conducta-2.0-4baaaa.svg "Código de conducta"

[changelog]: CHANGELOG.md "Histórico de cambios"

[donate-badge]: https://img.shields.io/badge/Donaci%C3%B3n-PayPal-red.svg
[donate-url]: https://paypal.me/oscarnovasf "Haz una donación"
