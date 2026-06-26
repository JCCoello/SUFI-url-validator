# SUFI-107 — Smoke: Playwright A11y Pass (run log)

**Fecha:** 2026-06-26
**Tester:** JCCoello (juancarlos.coello@applydigital.com)
**Tipo de ejecución:** Automatizado — Playwright DOM/ARIA via MCP
**Nota:** Los ACs funcionales (AC1–AC8) fueron verificados manualmente antes de esta sesión. Esta ejecución cubre únicamente la capa de accesibilidad.

---

## Entorno

| Variante | URL |
|----------|-----|
| Variante A | https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/aprende-con-sufi/pagos-y-extractos/article1 |
| Variante B | https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/aprende-con-sufi/derecho-y-acompanamiento/article2 |

---

## Verificaciones automatizadas (DOM/ARIA)

| Check | Variante A | Variante B | Notas |
|-------|-----------|-----------|-------|
| `lang="es"` en `<html>` | ✅ | ✅ | |
| `<main>` landmark presente | ✅ | ✅ | |
| `<article>` semántico presente | ✅ | ✅ | |
| H1 dentro del `<article>` | ✅ | ✅ | Texto placeholder de Contentful |
| Todas las imágenes con `alt` | ✅ (4/4) | ✅ (4/4) | |
| Todos los botones con nombre accesible | ✅ (17/17) | ✅ (20/20) | |
| `tabindex > 0` (antipatrón) | ✅ ninguno | ✅ ninguno | |
| MlShareStrip — botones con `aria-label` | ✅ 4/4 | ✅ 4/4 | Instagram, X, Facebook, Compartir |
| MlCard — enlaces con `aria-label` | ✅ "Ver más" | ✅ "Ver más" | |
| `<footer>` contentinfo | ✅ | ✅ | |
| Breadcrumb `<nav>` con `aria-label` | ❌ | ❌ | Sin etiqueta en mobile y desktop |
| `aria-current="page"` en breadcrumb | ❌ | ❌ | Ítem activo no marcado |
| `<title>` de página (artículo específico) | ❌ "Home" | ❌ "Home" | |
| Skip-to-main link | ❌ | ❌ | |
| Links sin nombre accesible | ❌ 2 | ❌ 3 | Íconos sociales footer (TikTok, X) |
| Jerarquía de headings sin saltos | ❌ H3→H5 | ❌ H2→H5 | Se salta H4 en ambas variantes |
| `<nav>` múltiples con `aria-label` | ❌ 4 navs sin label | ❌ 4 navs sin label | |

---

## Defectos encontrados

### [A11Y-1] Links de redes sociales en footer sin nombre accesible

**Severidad:** Alta · **WCAG:** 2.4.4 Link Purpose (A)

**Observado:** Los íconos de TikTok y X/Twitter en el footer renderizan como `<a role="link">` sin `aria-label`, sin texto visible y sin `href`. El SVG interno tiene `aria-label="circle-fill-tiktok"` / `aria-label="circle-fill-x"` (nombres de clases de ícono, no etiquetas de usuario). En Variante B hay además un `<a>` completamente vacío (`innerHTML=""`).

**Esperado:** Cada link de red social debe tener un `aria-label` descriptivo en el elemento `<a>` (ej. `aria-label="TikTok"`), y un `href` válido o `href="#"` con manejo de evento.

**Selector afectado:** `a.at-link[role="link"]` (footer, ambas variantes)

---

### [A11Y-2] Breadcrumb sin `aria-label` y sin `aria-current="page"`

**Severidad:** Media · **WCAG:** 2.4.8 Location (AAA), 1.3.1 Info and Relationships (A)

**Observado:** Existen 2 `<nav>` de breadcrumb (mobile + desktop, clase `bc-breadcrumb`) pero ninguno tiene `aria-label`. Los lectores de pantalla no pueden distinguir estos navs del menú principal ni del submenú. El ítem activo no tiene `aria-current="page"`.

**Esperado:** `<nav aria-label="Ruta de navegación">` (o equivalente) en ambas instancias. El último ítem del breadcrumb debe llevar `aria-current="page"`.

---

### [A11Y-3] `<title>` de página muestra "Home" en ambas variantes

**Severidad:** Media · **WCAG:** 2.4.2 Page Titled (A)

**Observado:** `document.title === "Home"` en las URLs `/article1` y `/article2`. Los usuarios de lector de pantalla y teclado que navegan por pestañas no pueden identificar el artículo activo.

**Esperado:** El `<title>` debe reflejar el título del artículo, ej. `"Titulo del contenido de la página… | Aprende con Sufi | Sufi"`.

---

### [A11Y-4] Jerarquía de headings con saltos de nivel

**Severidad:** Media · **WCAG:** 1.3.1 Info and Relationships (A)

**Observado:**
- **Variante A:** H3 → H5 en la sección del footer (se omite H4). H5 y H6 duplican el mismo texto ("Legales", "Te puede interesar").
- **Variante B:** H2 → H5 en los ítems del accordion "Preguntas relacionadas" (se omiten H3 y H4). También H2 → H4 en sección de Bottom Content.

**Esperado:** Jerarquía de headings continua sin saltos. Los accordions deben usar H3 si están dentro de una sección H2.

---

### [A11Y-5] Sin skip-to-main-content link

**Severidad:** Baja-Media · **WCAG:** 2.4.1 Bypass Blocks (A)

**Observado:** No existe enlace de salto al contenido principal (`a[href="#main"]` o similar). Usuarios de teclado deben tabular por todo el header y navegación en cada carga de página.

**Esperado:** Primer elemento enfocable de la página debe ser un enlace visible al recibir foco: `<a href="#main" class="skip-link">Ir al contenido principal</a>`.

---

### [A11Y-6] `<nav>` múltiples sin `aria-label` para diferenciarlos

**Severidad:** Baja · **WCAG:** 2.4.6 Headings and Labels (AA)

**Observado:** 4 elementos `<nav>` por página (menú principal, submenú, breadcrumb mobile, breadcrumb desktop), ninguno con `aria-label`. Los lectores de pantalla listan todos como "navigation" sin distinción.

**Esperado:** Cada `<nav>` con etiqueta única, ej. `aria-label="Menú principal"`, `aria-label="Submenú"`, `aria-label="Ruta de navegación"`.

---

## Observaciones (no defectos bloqueantes)

- **Texto de ícono visible en MlShareStrip:** Los botones de Instagram y Facebook renderizan texto `"line-instagram"` / `"line-facebook"` / `"share"` como contenido de texto visible (nombre de clase del ícono). Está cubierto por `aria-label` para AT, pero puede ser indicio de un fallo en la carga del web font de íconos o un problema de rendering visual.
- **`aria-label="Ver más"` en MlCard:** Funciona, pero al haber múltiples cards la etiqueta es ambigua sin contexto. Sería más robusto `aria-label="Ver más sobre [título del artículo]"`.

---

## Capturas

| Archivo | AC | Descripción |
|---------|----|-------------|
| `sufi107-AC1-variantA-a11y.png` | AC1 | Variante A — `<article>` semántico destacado |
| `sufi107-AC2-variantB-a11y.png` | AC2 | Variante B — `<article>` semántico destacado |
| `sufi107-AC5-mlShareStrip-a11y.png` | AC5 | MlShareStrip — botones con aria-labels verificados |
