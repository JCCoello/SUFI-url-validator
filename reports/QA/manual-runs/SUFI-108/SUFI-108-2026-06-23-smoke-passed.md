# SUFI-108 — Smoke: Manual + Playwright (run log)

- **Fecha:** 2026-06-23
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook: https://sufi-acl.vercel.app/
  - App DEV: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/categories
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-108-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 5/5 Pass — sin defectos encontrados

---

## Resumen por caso

### 1. [SUFI-108] [AC1] — El componente Card con tagPosition:image renderiza en Storybook con la etiqueta de categoría sobre la imagen
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia default del componente Card en Storybook con el argumento tagPosition:image en https://sufi-acl.vercel.app/?path=/story/molecules-card--default&args=tagPosition:image con el Canvas completamente cargado; DevTools abierto en la pestaña Console
- **WHEN** observar visualmente el componente en el canvas verificando que la etiqueta o badge de categoría se muestra superpuesto sobre la imagen del Card; verificar también que el título del artículo y los demás metadatos visibles están presentes y correctamente alineados; revisar la consola en busca de errores o advertencias
- **THEN** la etiqueta de categoría aparece sobre la imagen del Card sin desalineamiento ni desbordamiento; el título y los metadatos del Card son visibles y correctamente formateados; la consola no reporta errores ni advertencias relacionadas con el componente
- **Esperado:** el componente Card con tagPosition:image renderiza con la etiqueta de categoría sobre la imagen y todos sus campos correctamente sin errores en Storybook

---

### 2. [SUFI-108] [AC2] — El componente Paginator (organismo) renderiza en Storybook con la estructura de navegación correcta
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia default del componente Paginator en Storybook en https://sufi-acl.vercel.app/?path=/story/organisms-paginator--default con el Canvas completamente cargado; DevTools abierto en la pestaña Console
- **WHEN** observar visualmente el Paginator en el canvas verificando la presencia de los controles de navegación (botones anterior y siguiente, números de página con la página activa destacada visualmente); revisar la consola en busca de errores o advertencias
- **THEN** el Paginator muestra los controles de navegación completos con la página activa destacada; la consola no reporta errores ni advertencias relacionadas con el componente
- **Esperado:** el componente Paginator renderiza con la estructura de navegación correcta y sin errores en Storybook

---

### 3. [SUFI-108] [AC3] — La página de Categorías muestra una tab por cada smCategory y la primera tab lista todos los smBlogs
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de Categorías en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/categories completamente cargada; DevTools abierto en la pestaña Console
- **WHEN** contar las tabs de categoría visibles en la página; verificar que la primera tab (seleccionada por defecto) muestra la grilla con todos los blogs disponibles sin aplicar ningún filtro de categoría; revisar la consola en busca de errores
- **THEN** el número de tabs de categoría corresponde a las categorías existentes; la primera tab muestra todos los blogs disponibles sin filtro; la consola no reporta errores relacionados con la carga de categorías ni de blogs
- **Esperado:** la página de Categorías genera una tab por cada smCategory y la primera tab lista todos los smBlogs disponibles sin errores

---

### 4. [SUFI-108] [AC4] — Al seleccionar una tab de categoría los blogs se filtran por esa categoría y el Paginator navega entre páginas correctamente
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de Categorías en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/categories con más de una tab de categoría visible y con blogs asociados a distintas categorías; DevTools abierto en las pestañas Console y Network
- **WHEN** hacer clic en una tab de categoría diferente a la primera (segunda tab); esperar a que la grilla de Cards se actualice; verificar que todos los Cards mostrados pertenecen a la categoría seleccionada; verificar que el Paginator refleja el número correcto de páginas; si hay más de una página, hacer clic en el botón siguiente y verificar que la grilla se actualiza sin recarga completa
- **THEN** al seleccionar una tab de categoría la grilla muestra únicamente los blogs de esa categoría; el Paginator refleja el número correcto de páginas para el filtro activo; la navegación entre páginas actualiza la grilla sin recarga completa; la consola no reporta errores relacionados con el filtrado ni con la paginación
- **Esperado:** al seleccionar una tab la grilla filtra correctamente los blogs por categoría y el Paginator navega entre páginas sin errores

---

### 5. [SUFI-108] [AC5] — El template de Categorías es responsivo en viewports de tablet (768px) y móvil (375px)
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de Categorías en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/categories completamente cargada; DevTools abierto con Device Toolbar activa
- **WHEN** configurar el viewport a 768px de ancho (tablet) y verificar que las tabs, la grilla de Cards, el Paginator y las secciones de contenido se muestran sin desbordamiento horizontal; a continuación configurar el viewport a 375px (móvil) y repetir las verificaciones
- **THEN** en viewport tablet (768px) todos los elementos se muestran completos sin desbordamiento horizontal; en viewport móvil (375px) el template se adapta al ancho disponible con todos los elementos accesibles y sin overflow horizontal; en ambos viewports la consola no reporta errores
- **Esperado:** el template de Categorías se visualiza y funciona correctamente en viewports de tablet (768px) y móvil (375px) sin desbordamiento ni pérdida de elementos

---

## Verificación automatizada (Playwright)

| AC | Check | Resultado | Detalle |
|----|-------|-----------|---------|
| AC1 | Tag `.ml-card__media-tag` presente en DOM | ✅ Pass | Clase `bc-position-absolute ml-card__media-tag bc-translate-middle-x bc-start-50` confirmada |
| AC1 | Tag superpuesto sobre imagen | ✅ Pass | tagRect.top:200 < imgRect.bottom:216 — `overlapsImage: true` |
| AC1 | Título del Card visible | ✅ Pass | H3 `.ml-card__title` con texto "Principal Title" presente |
| AC1 | Consola sin errores de componente | ✅ Pass | Solo errores pre-auth 401 y Figma Design addon 404 — no relacionados al componente |
| AC2 | Botones prev/next presentes | ✅ Pass | Dos `.or-paginator__arrow-btn` (long-arrow-left / long-arrow-right), ninguno disabled |
| AC2 | Página activa destacada | ✅ Pass | Página 1 con `background: rgb(227, 23, 33)` (rojo SUFI), `aria-label="Página 1"` |
| AC2 | Botones de página disponibles | ✅ Pass | 6 botones (páginas 1–5 y 8) presentes en el DOM |
| AC2 | Consola sin errores de componente | ✅ Pass | Solo 503 CDN Bancolombia y 404 Figma embed — no relacionados al componente |
| AC3 | Tabs presentes | ✅ Pass | 5 tabs: Todos, Créditos y financiación, Pagos y extractos, Tu vehículo y trámites, Seguridad financiera |
| AC3 | Primera tab activa por defecto | ✅ Pass | Clase `ml-tab-item--regular--active` en tab "Todos" (fontWeight 600 vs 400 en inactivas) |
| AC3 | Cards visibles en vista "Todos" | ✅ Pass | 6 tarjetas (Blog 1–6) presentes; Paginator muestra 2 páginas |
| AC4 | Tab 2 filtra correctamente | ✅ Pass | "Créditos y financiación" activa — grilla reducida a 2 cards (Blog 1, Blog 2) |
| AC4 | Paginator refleja filtro activo | ✅ Pass | Controles prev/next con `aria-label="Página anterior/siguiente"` confirmados |
| AC4 | Navegación a página 2 | ✅ Pass | Click en Página 2 cargó Blog 7; botón página 2 con bg rgb(227, 23, 33) activo |
| AC4 | Sin errores 4xx/5xx en red | ✅ Pass | Sin respuestas de error en actualizaciones de grilla |
| AC5 | Sin overflow horizontal desktop 1280px | ✅ Pass | `scrollWidth === clientWidth === 1280` — línea base confirmada |
| AC5 | Sin overflow horizontal tablet 768px | ✅ Pass | Spec `setViewportSize(768, 1024)` — `hasHorizontalScroll: false` |
| AC5 | Sin overflow horizontal móvil 375px | ✅ Pass | Spec `setViewportSize(375, 812)` — `hasHorizontalScroll: false` |

---

## Evidencia (screenshots)

| Archivo | AC | Descripción |
|---------|----|-------------|
| `sufi108-AC1-card-tagposition-image.png` | AC1 | Storybook — Card con badge de categoría superpuesto sobre la imagen; tagPosition:image seleccionado en Controls |
| `sufi108-AC2-paginator-default.png` | AC2 | Storybook — Paginator con página 1 activa (rojo SUFI), botones de página 1–5 y 8, flecha de navegación →  |
| `sufi108-AC3-categories-tabs.png` | AC3 | DEV /categories — 5 tabs (Todos activo), grilla 3 columnas, cards con tagPosition:image |
| `sufi108-AC4-categories-tab2-filtered.png` | AC4 | DEV /categories — tab "Créditos y financiación" activo, grilla filtrada a 2 cards |
| `sufi108-AC4-categories-page2.png` | AC4 | DEV /categories — página 2 del Paginator en "Todos", Blog 7 visible |
| `sufi108-AC5-categories-768px.png` | AC5 | DEV /categories a 768px — 2 columnas, sin overflow horizontal (scrollWidth === 768) |
| `sufi108-AC5-categories-375px.png` | AC5 | DEV /categories a 375px — 1 columna, sin overflow horizontal (scrollWidth === 375) |

---

## Notas

- Spec automatizado generado en `tests/sufi-108-smoke.spec.ts` — cubre los 5 ACs con aserciones DOM y screenshots con badge overlay.
- Los errores 401 en consola de Storybook corresponden a intentos de carga previos a la autenticación en el auth wall de Vercel — no son errores del componente.
- Los errores 503 (CDN Bancolombia) y 404 (Figma embed addon) son externos al componente Paginator y no afectan su funcionamiento.
- AC3: se encontraron exactamente 5 tabs correspondientes a las categorías activas en Contentful DEV.
- AC4: con 7 blogs en total (6 en página 1, 1 en página 2), el filtro por "Créditos y financiación" retorna 2 blogs correctamente.
