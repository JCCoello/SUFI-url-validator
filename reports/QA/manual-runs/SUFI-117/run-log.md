# SUFI-117 — Smoke: Playwright A11y Pass (run log)

**Fecha:** 2026-06-26
**Tester:** JCCoello (juancarlos.coello@applydigital.com)
**Tipo de ejecución:** Automatizado — Playwright DOM/ARIA via MCP
**Nota:** Los ACs funcionales (AC1–AC4) fueron verificados manualmente antes de esta sesión. Esta ejecución cubre únicamente la capa de accesibilidad.

---

## Entorno

| Variante | URL |
|----------|-----|
| Variante 1 | https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/aprende-con-sufi/derecho-y-acompanamiento/article2 |
| Variante 2 | https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/aprende-con-sufi/derecho-y-acompanamiento/article3 |

---

## Verificaciones automatizadas (DOM/ARIA)

| Check | Variante 1 | Variante 2 | Notas |
|-------|-----------|-----------|-------|
| `lang="es"` en `<html>` | ✅ | ✅ | |
| `<main>` landmark presente | ✅ | ✅ | |
| `<article>` semántico presente | ✅ | ✅ | |
| H1 dentro del `<article>` | ✅ | ✅ | Texto placeholder de Contentful |
| Un solo H1 por página | ✅ | ❌ | V2: 2 H1 (banner + artículo) |
| Todas las imágenes con `alt` | ✅ (4/4) | ✅ (6/6) | |
| Todos los botones con nombre accesible | ✅ (20/20) | ✅ (18/18) | |
| `tabindex > 0` (antipatrón) | ✅ ninguno | ✅ ninguno | |
| MlShareStrip — botones con `aria-label` | ✅ 4/4 | N/A | V2 no incluye MlShareStrip |
| `<footer>` contentinfo | ✅ | ✅ | |
| Breadcrumb `<nav>` con `aria-label` | ❌ | ❌ | Sin etiqueta en mobile y desktop |
| `aria-current="page"` en breadcrumb | ❌ | ❌ | Ítem activo no marcado |
| `<title>` de página (artículo específico) | ❌ "Home" | ❌ "Home" | |
| Skip-to-main link | ❌ | ❌ | |
| Links sin nombre accesible | ❌ 5 | ❌ 5 | Logo header, íconos sociales footer, links vacíos |
| Jerarquía de headings sin saltos | ❌ H2→H5 | ❌ H2→H5 | Se salta H3 y H4 en accordions |
| `<nav>` múltiples con `aria-label` | ❌ 4 navs sin label | ❌ 4 navs sin label | |
| MlRichText — sin pie de imagen en asset embebido | N/A (sin imagen) | ✅ sin caption | `<figure class="ml-rich-text__embedded-asset">` vacío |
| Sin overflow horizontal en 768px | ✅ | — | Verificado en V1 |
| Sin overflow horizontal en 375px | ✅ | — | Verificado en V1 |
| Sin errores en DOM | ✅ | ✅ | |

---

## Defectos encontrados

### [A11Y-1] Variante 2 — Dos H1 en la misma página

**Severidad:** Alta · **WCAG:** 1.3.1 Info and Relationships (A)

**Observado:** La página de Variante 2 (`/article3`) renderiza dos elementos H1: uno en el componente de banner hero ("Sufi te presta para comprar el camión que tu negocio necesita") y otro en el cuerpo del artículo ("Título principal de la página"). Los lectores de pantalla anuncian ambos como encabezados de nivel 1, rompiendo la jerarquía semántica.

**Esperado:** Una sola instancia de `<h1>` por página, correspondiente al título principal del artículo. El banner debe usar H2 o un elemento no-heading.

**Selector afectado:** `h1` (2 instancias en `/article3`)

---

### [A11Y-2] `<title>` de página muestra "Home" en ambas variantes

**Severidad:** Media · **WCAG:** 2.4.2 Page Titled (A)

**Observado:** `document.title === "Home"` en `/article2` y `/article3`. Mismo defecto documentado en SUFI-107 [A11Y-3].

**Esperado:** El `<title>` debe reflejar el título del artículo, ej. `"Titulo del contenido… | Aprende con Sufi | Sufi"`.

---

### [A11Y-3] Breadcrumb sin `aria-label` y sin `aria-current="page"`

**Severidad:** Media · **WCAG:** 2.4.8 Location (AAA), 1.3.1 Info and Relationships (A)

**Observado:** 4 elementos `<nav>` por página (menú principal, submenú, breadcrumb mobile, breadcrumb desktop), ninguno con `aria-label`. El ítem activo del breadcrumb no tiene `aria-current="page"`. Mismo defecto documentado en SUFI-107 [A11Y-2] y [A11Y-6].

**Esperado:** `<nav aria-label="Ruta de navegación">` en ambas instancias del breadcrumb. Último ítem con `aria-current="page"`.

---

### [A11Y-4] Links sin nombre accesible (header logo + íconos footer)

**Severidad:** Alta · **WCAG:** 2.4.4 Link Purpose (A)

**Observado:** 5 links sin `aria-label`, sin texto visible y sin `title`: el logo del header (`<a data-testid="or-menu-header-logo">`), el logo del footer (`<a data-testid="footer-brand-link">`), y 3 links de íconos sociales en footer con `href` nulo. Mismo patrón que SUFI-107 [A11Y-1].

**Esperado:** Cada link con `aria-label` descriptivo (ej. `aria-label="Sufi — Ir a inicio"`) y `href` válido.

---

### [A11Y-5] Jerarquía de headings con saltos de nivel

**Severidad:** Media · **WCAG:** 1.3.1 Info and Relationships (A)

**Observado:**
- **Ambas variantes:** H2 → H5 en los accordions (se omiten H3 y H4); H5 y H6 duplican el mismo texto en footer ("Legales", "Te puede interesar").
- Mismo defecto documentado en SUFI-107 [A11Y-4].

**Esperado:** Jerarquía continua sin saltos. Los accordions dentro de una sección H2 deben usar H3.

---

### [A11Y-6] Sin skip-to-main-content link

**Severidad:** Baja-Media · **WCAG:** 2.4.1 Bypass Blocks (A)

**Observado:** No existe enlace de salto al contenido principal. Mismo defecto documentado en SUFI-107 [A11Y-5].

**Esperado:** Primer elemento enfocable: `<a href="#main" class="skip-link">Ir al contenido principal</a>`.

---

## Observaciones (no defectos bloqueantes)

- Los defectos A11Y-2 a A11Y-6 son sistémicos (presentes en todo el sitio, ya reportados en SUFI-107). No son regresiones introducidas por SUFI-117.
- **AC3 confirmado:** El `<figure class="ml-rich-text__embedded-asset bc-my-3">` en Variante 2 contiene la imagen embebida sin ningún `<figcaption>` ni texto de pie de imagen — comportamiento correcto según el AC.
- **Variante 2 carece de campos autor y fecha** en el DOM — puede ser contenido Contentful pendiente de completar, no necesariamente un defecto de template.

---

## Capturas

| Archivo | AC | Descripción |
|---------|----|-------------|
| `sufi117-AC1-variantA-a11y.png` | AC1 | Variante 1 — `<article>` semántico destacado |
| `sufi117-AC2-variantB-a11y.png` | AC2 | Variante 2 — `<article>` destacado (doble H1 visible) |
| `sufi117-AC3-mlRichText-no-caption.png` | AC3 | MlRichText — imagen embebida sin pie de imagen |
| `sufi117-AC4-tablet-768px.png` | AC4 | Tablet 768px — sin overflow, todas las secciones visibles |
| `sufi117-AC4-mobile-375px.png` | AC4 | Móvil 375px — sin overflow, contenido legible |
