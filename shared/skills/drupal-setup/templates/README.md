# {{PROJECT_NAME}}

Proyecto {{DRUPAL_VARIANT}}.

## Inicio Rápido

### Requisitos previos

- [DDEV](https://ddev.readthedocs.io/en/stable/#installation) instalado
- [Docker](https://docs.docker.com/get-docker/) instalado y en ejecución

### Configuración del entorno local

```bash
# Clonar el repositorio (o descargarlo)
git clone <REPO_URL> {{PROJECT_NAME}}
cd {{PROJECT_NAME}}

# Configurar e iniciar DDEV
ddev config
ddev start

# Instalar dependencias
ddev composer install

# Instalar Drupal
ddev drush site:install --existing-config --account-pass=admin -y

# Acceder al sitio
ddev launch
```

## Estructura del Proyecto

```
{{PROJECT_NAME}}/
├── .ddev/              # Configuración de DDEV
├── config/sync/         # Archivos de configuración de Drupal
├── vendor/             # Dependencias de Composer (no en Git)
├── web/                # Raíz web de Drupal
│   ├── core/           # Drupal core (no en Git)
│   ├── modules/        # Módulos contribuidos y custom
│   ├── themes/         # Temas contribuidos y custom
│   └── sites/          # Archivos específicos del sitio
├── composer.json       # Dependencias PHP
└── README.md           # Este archivo
```

## Flujo de Trabajo

### Cambios de configuración

1. Realizar cambios en la interfaz de Drupal o mediante código
2. Exportar configuración:
   ```bash
   ddev drush config:export -y
   ```
3. Revisar cambios:
   ```bash
   git diff config/sync
   ```
4. Commit y push:
   ```bash
   git add config/sync
   git commit -m "Descripción de los cambios de configuración"
   ```

### Instalar módulos

```bash
# Descargar mediante Composer
ddev composer require drupal/nombre_modulo

# Habilitar el módulo
ddev drush en nombre_modulo -y

# Exportar configuración
ddev drush config:export -y
```

### Sincronizar cambios del equipo

```bash
git pull
ddev composer install
ddev drush config:import -y
ddev drush updb -y
ddev drush cache:rebuild
```

## Calidad de Código

### Estándares de codificación

```bash
ddev exec phpcs --standard=Drupal web/modules/custom
```

### Análisis estático

```bash
ddev phpstan
```

### Tests

```bash
ddev phpunit <testsuite>
```

## Solución de Problemas

### Error de conexión a base de datos

```bash
ddev restart
```

### Error de permisos

```bash
ddev ssh
chmod -R 755 web/sites/default/files
```

### Fallo al importar configuración

```bash
# Verificar diferencias de configuración
ddev drush config:status

# Importar parcialmente
ddev drush config:import --partial -y
```

### Limpiar cachés

```bash
ddev drush cache:rebuild
```

## Configuración con Claude Code

Este proyecto fue configurado con la skill `/drupal-setup` de [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

- Para configurar el entorno por primera vez o reiniciarlo, ejecuta `/drupal-setup` en Claude Code.
- Consulta `CLAUDE.md` para ver las directrices y comandos específicos de este proyecto.

## Recursos

- [Documentación de Drupal](https://www.drupal.org/documentation)
- [Documentación de DDEV](https://ddev.readthedocs.io/)
- [Documentación de Drush](https://www.drush.org/)
