# SUFI-103 — Smoke: Manual + Playwright (run log)

**Fecha:** 2026-06-17 · **Tester:** JCCoello · **Entorno:** DEV + QA + Storybook

---

## Precondición

Entrada de Contentful del Header (`5OZKea4pGMtgJEO48svILD`, environment: development) configurada vía la entrada Inicio (`3NsZhK7uGX9UZpmrw3Td9K`) con **6 ítems en la barra blanca** (3 originales + 3 duplicados añadidos en sesión anterior). Todo en **borrador (draft)**. Sin publicación.

> **Nota:** Los ACs verifican el comportamiento de la **columna del panel desplegable** (`.or-menu-header-desktap__navigation-category`), no el conteo de botones en la barra blanca. La columna en DEV tiene altura auto; en QA tiene height fija de 180px que provoca wrap a 2ª columna al superar 4 ítems.

---

## Verificación automatizada

| AC | Descripción | Resultado | Notas |
|----|-------------|-----------|-------|
| AC1 | Columna del panel desplegable — 1 columna sin wrap · desktop 1280px | ✅ Pass | 5 enlaces, todos x=58; height:232px auto; display:flex; flexWrap:nowrap; consola: 0 errores |
| AC2 | Alineación y espaciado — desktop | ✅ Pass | Espaciado uniforme 36px entre ítems; todos alineados a x=58; sin desbordamientos |
| AC3 | Storybook or-menu-header — capacidad de 1 columna para 5+ ítems | ✅ Pass | "Productos y Servicios" abre panel con 5 ítems en 1 columna (x=58, height:232px auto); mismo CSS nuevo que DEV |
| AC4 | DEV (1 columna) vs QA (wrap a 2ª columna al superar 4 ítems) | ✅ Pass | DEV "Clientes": 5 ítems, todos x=58, height:232px auto. QA "Clientes": ítem 5 "Paga tu cuota" en x=347 (2ª columna), height:180px fija en el padre |
| AC5 | Funcionalidad de enlaces del panel | ⚠️ Observación | 5 enlaces visibles, 0 errores de consola. 4/5 hrefs vacíos (contenido draft en Contentful development — esperado); 1 href configurado (Propuesta de valor → `/`) |

---

## Hallazgos técnicos clave

### CSS — Diferencia DEV vs QA

| Propiedad | DEV (nueva implementación) | QA (implementación anterior) |
|-----------|---------------------------|------------------------------|
| `.or-menu-header-desktap__navigation-category` height | `232px` (auto, crece con el contenido) | `180px` (fija, limita a ~4 ítems) |
| Ítem 5 posición x | `58px` (misma columna) | `347px` (2ª columna) |
| Columnas visibles con 5 ítems | **1 columna** | **2 columnas** |
| Padre `.or-menu-header-desktop__navigation` | `flex-wrap: wrap; height: auto` | `flex-wrap: wrap; height: 260px` |

### AC5 — Observación hrefs

Los 4 hrefs vacíos son contenido draft en el entorno development de Contentful, no un defecto del componente. El componente renderiza y es clickeable. Sin errores de consola ni de red.

---

## Notas

- **AC3 — Storybook:** El story usa datos hardcodeados (Productos y Servicios: 5 ítems; Seguros: independiente; etc.) no conectados a Contentful. El CSS aplicado ES el nuevo CSS — la columna crece a height auto para acomodar 5+ ítems en una sola columna. Story muestra 4 ítems en la barra blanca (Productos y Servicios, Seguros, Aprende con Sufi, Comercios aliados).
- **AC4 — contraste real:** Sección "Clientes" en QA tiene 5 ítems (Productos, Créditos, Seguros, Tus beneficios, Paga tu cuota). Los primeros 4 aparecen en columna 1 (x=58); el 5º aparece en columna 2 (x=347). En DEV la misma sección muestra los 5 ítems en columna única.
- Consola DEV: 0 errores en todos los viewports verificados.
- Precondición configurada en draft mode; sin publicación en Contentful.

---

## Evidencia

| Archivo | Descripción |
|---------|-------------|
| `sufi103-AC1-columna-dev.png` | AC1 — DEV 1280px: 5 ítems en columna única, badge AC1 |
| `sufi103-AC2-layout-dev.png` | AC2 — DEV: alineación y espaciado uniforme, badge AC2 |
| `sufi103-AC3-storybook-1columna.png` | AC3 — Storybook: panel Productos y Servicios con 5 ítems en 1 columna |
| `sufi103-AC4-DEV-1columna.png` | AC4 DEV — Clientes: 5 ítems, todos x=58, height:232px auto |
| `sufi103-AC4-QA-2columnas.png` | AC4 QA — Clientes: ítem 5 "Paga tu cuota" en 2ª columna (x=347) |
| `sufi103-AC5-enlaces-panel.png` | AC5 — 5 enlaces visibles, consola: 0 errores |
