---
name: playwright
description: >
  Playwright E2E testing patterns para Drupal.
  Trigger: Cuando se escriben tests E2E - Page Objects, selectores, workflow MCP.
---

## MCP Workflow (OBLIGATORIO si está disponible)

**Si tienes las herramientas MCP de Playwright, SIEMPRE úsalas ANTES de crear cualquier test:**

1. **Navega** a la página objetivo
2. **Toma snapshot** para ver la estructura y elementos reales
3. **Interactúa** con formularios/elementos para verificar el flujo exacto
4. **Toma screenshots** para documentar estados esperados
5. **Verifica transiciones** de página (carga, éxito, error)
6. **Documenta selectores reales** obtenidos del snapshot
7. **Solo después de explorar** crea el código del test con selectores verificados

**Si MCP NO está disponible:** Procede con la creación del test basándote en la documentación y el análisis del código.

**Por qué es importante:**
- ✅ Tests precisos — pasos exactos, sin suposiciones
- ✅ Selectores exactos — estructura DOM real, no imaginada
- ✅ Validación del flujo real — verificar que el recorrido funciona
- ✅ Evitar sobre-ingeniería — tests mínimos para lo que existe
- ✅ Prevenir tests inestables — exploración real = tests estables
- ❌ Nunca asumir cómo "debería" funcionar la UI de Drupal

## Estructura de Archivos

```
tests/
├── base-page.ts              # Clase padre para TODAS las páginas
├── helpers.ts                # Utilidades compartidas
└── {page-name}/
    ├── {page-name}-page.ts   # Page Object Model
    ├── {page-name}.spec.ts   # TODOS los tests aquí (sin archivos separados)
    └── {page-name}.md        # Documentación de tests
```

**Nomenclatura:**
- ✅ `node-form.spec.ts` (todos los tests del formulario de nodo)
- ✅ `node-form-page.ts` (page object)
- ✅ `node-form.md` (documentación)
- ❌ `node-form-validation.spec.ts` (INCORRECTO — no archivos separados)

## Prioridad de Selectores (OBLIGATORIO)

```typescript
// 1. MEJOR — getByRole para elementos interactivos
this.saveButton = page.getByRole("button", { name: "Save" });
this.adminLink  = page.getByRole("link", { name: "Content" });

// 2. MEJOR — getByLabel para controles de formulario
this.titleInput = page.getByLabel("Title");
this.bodyField  = page.getByLabel("Body");

// 3. CON MODERACIÓN — getByText para contenido estático
this.errorMsg   = page.getByText("This field is required");

// 4. ÚLTIMO RECURSO — getByTestId cuando lo anterior falla
this.widget     = page.getByTestId("date-picker");

// ❌ EVITAR selectores frágiles
this.btn   = page.locator(".button--primary");  // NO
this.input = page.locator("#edit-title-0-value"); // NO (IDs de Drupal cambian)
```

> **Nota Drupal**: Los IDs generados por Drupal (ej. `#edit-field-x-0-value`) son
> inestables entre versiones. Preferir roles y labels siempre.

## Detección de Alcance (PREGUNTAR SI AMBIGUO)

| El usuario dice | Acción |
|-----------------|--------|
| "un test", "un caso", "agregar test" | Crear UN test() en spec existente |
| "tests completos", "suite", "generar tests" | Crear suite completa |

## Page Object Pattern

```typescript
import { Page, Locator, expect } from "@playwright/test";

// BasePage — TODAS las páginas extienden esto
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState("networkidle");
  }

  async waitForDrupalMessage(): Promise<void> {
    await this.page.waitForSelector('[role="status"], .messages');
  }

  async getDrupalMessage(): Promise<string> {
    const msg = this.page.locator('[role="status"], .messages').first();
    return msg.textContent() ?? "";
  }
}

// Implementación específica de página
export class NodeFormPage extends BasePage {
  readonly titleInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.titleInput  = page.getByLabel("Title");
    this.saveButton  = page.getByRole("button", { name: "Save" });
  }

  async goto(nodeType = "article"): Promise<void> {
    await super.goto(`/node/add/${nodeType}`);
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await this.waitForDrupalMessage();
  }
}
```

## Reutilización de Page Objects (CRÍTICO)

Siempre verificar page objects existentes antes de crear nuevos:

```typescript
// ✅ BIEN: Reutilizar page objects existentes
import { AdminLoginPage } from "../admin-login/admin-login-page";
import { NodeFormPage }   from "../node-form/node-form-page";

test("Editor can create article", async ({ page }) => {
  const login    = new AdminLoginPage(page);
  const nodeForm = new NodeFormPage(page);

  await login.loginAs("editor");            // REUTILIZAR
  await nodeForm.goto("article");
  await nodeForm.fillTitle("Test Article");
  await nodeForm.save();
});

// ❌ MAL: Recrear funcionalidad existente
export class ArticleFormPage extends BasePage {
  async login() { /* AdminLoginPage ya tiene esto */ }
}
```

## Patrón de Tests con Tags

```typescript
import { test, expect } from "@playwright/test";
import { NodeFormPage } from "./node-form-page";

test.describe("Node Form", () => {
  test(
    "Editor puede crear un nodo de artículo",
    { tag: ["@critical", "@e2e", "@content", "@NODE-E2E-001"] },
    async ({ page }) => {
      const nodeForm = new NodeFormPage(page);

      await nodeForm.goto("article");
      await nodeForm.fillTitle("Mi artículo de prueba");
      await nodeForm.save();

      await expect(page, "La URL debe ajustarse al patrón de una página de nodo").toHaveURL(/\/node\/\d+/);
    }
  );
});
```

**Categorías de tags:**
- Prioridad: `@critical`, `@high`, `@medium`, `@low`
- Tipo: `@e2e`
- Feature: `@content`, `@admin`, `@forms`, `@taxonomy`
- Test ID: `@NODE-E2E-001`, `@ADMIN-E2E-002`

## Refactoring: Cuándo Mover Código

### Mover a `BasePage` cuando:
- ✅ Helpers de navegación usados por múltiples páginas
- ✅ Interacciones comunes de Drupal (mensajes de estado, diálogos de confirmación)
- ✅ Patrones de verificación repetidos (`waitForDrupalMessage`, `getDrupalMessage`)

### Mover a `helpers.ts` cuando:
- ✅ Generación de datos de test (`generateUniqueTitle()`, `generateTestNode()`)
- ✅ Utilidades de setup/teardown (`createTestUser()`, `cleanupContent()`)
- ✅ Helpers de API Drupal para setup (`seedContent()`, `resetState()`)

## Documentación de Tests ({page-name}.md)

```markdown
### E2E Tests: {Nombre de Feature}

**Suite ID:** `{SUITE-ID}`
**Feature:** {Descripción}

---

## Test Case: `{TEST-ID}` - {Título}

**Prioridad:** `{critical|high|medium|low}`

**Tags:** @e2e, @{feature}

**Descripción:** {Breve descripción}

**Precondiciones:**
- {Requisito previo}

### Pasos:
1. {Paso 1}
2. {Paso 2}

### Resultado esperado:
- {Resultado 1}

### Puntos de verificación:
- {Aserción 1}
```

**Reglas de documentación:**
- ❌ NO instrucciones generales de ejecución
- ❌ NO explicaciones de estructura de archivos
- ✅ Enfocarse SOLO en el caso de test específico
- ✅ Máximo 60 líneas cuando sea posible

## Comandos

```bash
npx playwright test                               # Todos los tests
npx playwright test --grep "content"              # Filtrar por nombre
npx playwright test --ui                          # Modo interactivo
npx playwright test --debug tests/node-form/      # Debug de carpeta
npx playwright test --grep "@critical"            # Solo tests críticos
npx playwright test --grep "@admin"               # Solo tests de admin
```

## Keywords
playwright, e2e, testing, drupal, page object model, selectores, mcp
