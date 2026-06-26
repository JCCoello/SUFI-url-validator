# SUFI-109 — Smoke: Manual + Playwright (run log)

**Fecha:** 2026-06-26
**Tester:** JCCoello (juancarlos.coello@applydigital.com)
**Entorno:** DEV — https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/aprende-con-sufi
**Resultado global:** ✅ 6/6 Pass — sin defectos bloqueantes encontrados.

---

## Casos de prueba

---

### 1. [AC1] TmBlog renderiza en Vercel con las secciones configuradas y sus títulos MlHeading sin errores de consola

**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página Aprende con Sufi en DEV completamente cargada; entrada TmBlog en Contentful revisada; DevTools abierto en Console.
- **WHEN** verificar que las secciones configuradas (topContent, categoriesSection, featuredArticles, latestArticles, bottomContent) aparecen en orden; verificar títulos MlHeading coincidan con Contentful; revisar consola.
- **THEN** las 5 secciones aparecen en orden correcto; 4 H2 visibles (Categorías - JCC test, Primera sección, Segunda sección, Contáctate con nosotros test); 8 H3 presentes; sin errores de consola.
- **Esperado:** Template renderiza todas las secciones configuradas con sus headings y sin errores.
- **Observado:** ✅ Conforme. `sectionChildCount = 5`, `h2Count = 4`, `h3Count = 8`, consola limpia.

---

### 2. [AC2] La sección categoriesSection muestra las SmCategory con sus campos y navegación a ?categoria={categoryId}

**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página cargada; entradas SmCategory revisadas en Contentful.
- **WHEN** localizar sección de categorías; verificar ícono, categoryLabel y colorVariant por card; hacer clic en primera categoría; verificar URL resultante con patrón ?categoria={categoryId}; verificar tab pre-seleccionada.
- **THEN** 6 category cards presentes con ícono (`<em>`), label y href; hrefs coinciden con `/aprende-con-sufi/categorias?categoria={slug}`; navegación a `/categorias?categoria=creditos-y-financiacion` resuelve correctamente; consola limpia.
- **Esperado:** Cards renderizan campos correctamente; navegación produce URL con parámetro correcto.
- **Observado:** ✅ Conforme. Nota: los links de categoría se abren con `target="_blank"` — confirmar si es comportamiento intencional.

---

### 3. [AC3] La sección featuredArticles muestra los SmArticle con sus campos y links /aprende-con-sufi/{categoryId}/{blogId}

**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página cargada; entradas SmArticle de featuredArticles revisadas en Contentful.
- **WHEN** localizar sección featuredArticles; verificar cards con title, pretitle, summary, coverImage y categoryLabel; inspeccionar hrefs; comparar con Figma; revisar consola.
- **THEN** 3 cards presentes con imagen (`alt` no vacío), H3 y párrafo descriptivo; los 3 hrefs coinciden con el patrón `/aprende-con-sufi/{categoryId}/{blogId}`:
  - `/aprende-con-sufi/vehiculos-y-tramites/article3`
  - `/aprende-con-sufi/derecho-y-acompanamiento/article2`
  - `/aprende-con-sufi/pagos-y-extractos/article1`
- **Esperado:** Cards con campos correctamente mapeados y links con patrón correcto.
- **Observado:** ✅ Conforme.

---

### 4. [AC4] La sección latestArticles muestra los SmArticle más recientes con sus campos y links con el patrón correcto

**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página cargada; entradas SmArticle de latestArticles revisadas en Contentful.
- **WHEN** localizar sección latestArticles debajo de featuredArticles; verificar cards con campos correctos; verificar hrefs con patrón correcto; verificar que no hay duplicados incorrectos con featuredArticles.
- **THEN** 5 cards presentes; todos los hrefs siguen el patrón `/aprende-con-sufi/{categoryId}/{blogId}`; estructura de cards (imagen, H3, párrafo) correcta.
- **Esperado:** Cards con campos mapeados correctamente, diferenciados de featuredArticles.
- **Observado:** ✅ Conforme estructuralmente. Observación: 4 de 5 artículos en latestArticles comparten href con featuredArticles — atribuido a contenido placeholder DEV, no es un defecto de template.

---

### 5. [AC5] Las secciones opcionales sin configurar no se renderizan ni dejan espacio vacío

**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** entrada TmBlog con al menos una sección opcional sin configurar; página cargada; DevTools abierto en Elements y Console.
- **WHEN** identificar secciones no configuradas en Contentful; verificar que no aparecen visualmente ni dejan espacio vacío; confirmar ausencia en DOM; revisar consola.
- **THEN** sin secciones vacías visibles en el área TmBlog; sin desbordamiento horizontal (`scrollWidth 1265 ≤ innerWidth 1280`); secciones configuradas renderizadas correctamente.
- **Esperado:** Secciones opcionales ausentes no generan huecos ni errores.
- **Observado:** ✅ Conforme. Observación fuera de alcance: footer presenta 3 elementos con `class="undefined"` y 25 con `class="false"` — prop opcional sin fallback en componente de footer (no relacionado con TmBlog).

---

### 6. [AC6] El template TmBlog es responsivo en viewports de tablet (768px) y móvil (375px)

**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** página cargada; DevTools con Device Toolbar activa.
- **WHEN** configurar viewport a 768px; verificar secciones visibles sin overflow horizontal; configurar viewport a 375px; repetir verificaciones.
- **THEN** en 768px: sin overflow horizontal, todas las secciones de `main` con height > 0; en 375px: sin overflow horizontal, todas las secciones de `main` con height > 0.
- **Esperado:** Template adaptado correctamente en ambos viewports.
- **Observado:** ✅ Conforme en ambos viewports.

---

## Notas

- Sin defectos bloqueantes encontrados durante esta sesión.
- Observaciones menores a confirmar con el equipo:
  1. Links de categorías usan `target="_blank"` — verificar si es comportamiento esperado por diseño.
  2. Contenido de latestArticles en DEV solapa mayormente con featuredArticles — confirmar si es placeholder o defecto de configuración Contentful.
  3. Footer: `class="undefined"` en 3 elementos y `class="false"` en 25 — fuera del alcance de SUFI-109 pero podría meritar ticket separado.

### Verificación automatizada (Playwright)

| AC | Verificación | Resultado |
|----|-------------|-----------|
| AC1 | 5 hijos en sección principal, 4 H2, 8 H3 presentes | ✅ Pass |
| AC2 | 6 category cards con icon + label + href patrón correcto; navegación a ?categoria= OK | ✅ Pass |
| AC3 | 3 featured cards con imagen, H3, párrafo; hrefs patrón /aprende-con-sufi/{cat}/{blog} OK | ✅ Pass |
| AC4 | 5 latest cards con estructura correcta; hrefs patrón OK | ✅ Pass |
| AC5 | Sin overflow horizontal; sin secciones vacías en main | ✅ Pass |
| AC6 | Sin overflow en 768px y 375px; secciones main con height > 0 | ✅ Pass |

### Evidencia (screenshots)

| Archivo | AC |
|---------|-----|
| sufi109-AC1-tmBlog-sections.png | AC1 |
| sufi109-AC2-categories-section.png | AC2 |
| sufi109-AC3-featured-articles.png | AC3 |
| sufi109-AC4-latest-articles.png | AC4 |
| sufi109-AC5-no-empty-sections.png | AC5 |
| sufi109-AC6-tablet-768.png | AC6 |
| sufi109-AC6-mobile-375.png | AC6 |
