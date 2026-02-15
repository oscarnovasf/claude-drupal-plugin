---
description: "Crear un Single Directory Component (SDC) de Drupal con plantilla Twig, CSS, JS y esquema de componente."
---

Ayuda a crear un Single Directory Component de Drupal.

## Uso

```bash
# Con descripción completa (infiere todo automáticamente)
/component Crear un card hero con imagen de fondo, título, subtítulo y botón CTA

# Con contexto parcial (pregunta solo lo que falta)
/component Card de testimonial con foto, nombre, cargo y cita

# Sin argumentos (modo interactivo completo)
/component
```

## Lógica de ejecución

1. **Analiza el texto que el usuario proporciona después de `/component`:**
   - Infiere el **nombre del componente** (convierte a formato kebab-case)
   - Extrae la **descripción** del componente
   - Identifica **props/slots necesarios** según la descripción
   - Detecta si menciona **interactividad o JavaScript** (hover, click, animación, etc.)
   - Considera **requisitos de accesibilidad** implícitos (botones, imágenes, modales, etc.)

2. **Si el texto es suficientemente descriptivo:**
   - NO hagas preguntas adicionales
   - Genera directamente la estructura completa
   - Documenta las decisiones tomadas en el archivo `.component.yml`

3. **Si falta información crítica:**
   - Pregunta SOLO lo que no puedas inferir razonablemente
   - Ejemplo: si no menciona interactividad, pregunta si necesita JavaScript

4. **Si NO hay texto (solo `/component`):**
   - Ejecuta el flujo interactivo completo:
     1. Nombre del componente
     2. Descripción
     3. Props/slots necesarios
     4. Si necesita comportamiento en JavaScript
     5. Requisitos de accesibilidad

## Generación de archivos

Genera la estructura completa:
- Directorio del componente bajo `components/`
- Plantilla Twig (`component-name.twig`)
- Definición del componente (`component-name.component.yml`)
- Archivo CSS con clases BEM
- Archivo JavaScript con Drupal.behaviors (si aplica)
- Ejemplo de uso mostrando cómo incrustar el componente

Sigue los estándares de Drupal SDC (10.1+) y garantiza cumplimiento WCAG 2.1 AA.
