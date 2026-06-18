# SUFI-101 — Manual Smoke (run log)

- **Fecha:** 2026-06-16
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - App DEV: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev#slider-buttons
  - Contentful (Development): https://app.contentful.com/spaces/1bla4bgmu67p/environments/development/entries/6mmrWJds6ZB2El9EUq4S1d
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-101-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 5/5 Pass — sin defectos encontrados

---

## Resumen por caso

### 1. [SUFI-101] [AC1] — Botones de navegación y puntos de paginación se ocultan cuando items = slides visibles en desktop
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la entrada de Contentful configurada con N entries en el campo slides y el mismo valor N en sliderDesktop (por ejemplo 3 entries y sliderDesktop = 3); la página de prueba en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev#slider-buttons completamente cargada en viewport de escritorio (≥ 1280px); DevTools abierto en la pestaña Console
- **WHEN** inspeccionar visualmente el or-slider en el viewport de escritorio verificando la presencia de los botones de navegación (flechas prev/next) y los puntos de paginación; revisar la consola en busca de errores relacionados con el componente
- **THEN** los botones de navegación y los puntos de paginación no son visibles en el or-slider; la consola no reporta errores relacionados con el componente
- **Esperado:** los botones de navegación y los puntos de paginación están ocultos en el or-slider cuando items = slides visibles configuradas para desktop
- **Observado:** conforme a lo esperado — botones y puntos de paginación no visibles; consola sin errores

---

### 2. [SUFI-101] [AC2] — Botones de navegación y puntos de paginación se ocultan cuando items = slides visibles en tablet
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la entrada de Contentful configurada con N entries en el campo slides y el mismo valor N en sliderTablet (por ejemplo 2 entries y sliderTablet = 2); la página de prueba completamente cargada; DevTools con Device Toolbar activa y viewport configurado a 768px
- **WHEN** inspeccionar visualmente el or-slider en el viewport de tablet (768px) verificando la presencia de los botones de navegación y los puntos de paginación; revisar la consola en busca de errores
- **THEN** los botones de navegación y los puntos de paginación no son visibles en el or-slider en viewport de tablet (768px); la consola no reporta errores relacionados con el componente
- **Esperado:** los botones de navegación y los puntos de paginación están ocultos en el or-slider en viewport tablet (768px) cuando items = slides visibles configuradas para tablet
- **Observado:** conforme a lo esperado — botones y puntos de paginación no visibles en 768px; consola sin errores

---

### 3. [SUFI-101] [AC3] — Botones de navegación y puntos de paginación se ocultan cuando items = slides visibles en móvil
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la entrada de Contentful configurada con N entries en el campo slides y el mismo valor N en sliderMobile (por ejemplo 1 entry y sliderMobile = 1); la página de prueba completamente cargada; DevTools con Device Toolbar activa y viewport configurado a 375px
- **WHEN** inspeccionar visualmente el or-slider en el viewport móvil (375px) verificando la presencia de los botones de navegación y los puntos de paginación; revisar la consola en busca de errores
- **THEN** los botones de navegación y los puntos de paginación no son visibles en el or-slider en viewport móvil (375px); la consola no reporta errores relacionados con el componente
- **Esperado:** los botones de navegación y los puntos de paginación están ocultos en el or-slider en viewport móvil (375px) cuando items = slides visibles configuradas para móvil
- **Observado:** conforme a lo esperado — botones y puntos de paginación no visibles en 375px; consola sin errores

---

### 4. [SUFI-101] [AC4] — Botones de navegación y puntos de paginación se muestran cuando items > slides visibles
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la entrada de Contentful configurada con M entries en el campo slides y un valor N < M en sliderDesktop (por ejemplo 5 entries y sliderDesktop = 3); la página de prueba completamente cargada en viewport de escritorio; DevTools abierto en la pestaña Console
- **WHEN** inspeccionar visualmente el or-slider en el viewport de escritorio verificando la presencia de los botones de navegación y los puntos de paginación; hacer clic en los botones de navegación para verificar que permiten avanzar y retroceder entre slides; revisar la consola en busca de errores
- **THEN** los botones de navegación y los puntos de paginación son visibles y funcionales; el slider permite navegar entre las slides adicionales; la consola no reporta errores relacionados con el componente
- **Esperado:** los botones de navegación y los puntos de paginación están visibles y funcionales cuando items > slides visibles configuradas
- **Observado:** conforme a lo esperado — botones y puntos de paginación visibles y funcionales; navegación entre slides operativa; consola sin errores

---

### 5. [SUFI-101] [AC5] — Botones de navegación y puntos de paginación también se ocultan cuando items < slides visibles
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la entrada de Contentful configurada con N entries en el campo slides y un valor M > N en sliderDesktop (por ejemplo 2 entries y sliderDesktop = 4); la página de prueba completamente cargada en viewport de escritorio; DevTools abierto en la pestaña Console
- **WHEN** inspeccionar visualmente el or-slider en el viewport de escritorio verificando la presencia de los botones de navegación y los puntos de paginación; revisar la consola en busca de errores
- **THEN** los botones de navegación y los puntos de paginación no son visibles en el or-slider (la condición ≤ cubre tanto items = slides visibles como items < slides visibles); la consola no reporta errores relacionados con el componente
- **Esperado:** los botones de navegación y los puntos de paginación están ocultos en el or-slider cuando items < slides visibles configuradas
- **Observado:** conforme a lo esperado — botones y puntos de paginación no visibles cuando items < slides visibles; consola sin errores

---

## Notas

- Sin defectos encontrados durante esta sesión.
- ACs 1, 2 y 3 validan el ocultamiento por viewport (desktop, tablet, móvil) cuando items = slides visibles.
- AC4 valida el comportamiento positivo (botones visibles y funcionales) cuando items > slides visibles.
- AC5 confirma que la condición de ocultamiento es items ≤ slides visibles (no solo items = slides visibles).
