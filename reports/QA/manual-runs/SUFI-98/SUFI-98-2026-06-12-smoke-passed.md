# SUFI-98 — Manual Smoke (run log)

- **Fecha:** 2026-06-12
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - App DEV: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev
  - Contentful (Development): https://app.contentful.com/spaces/1bla4bgmu67p/environments/development/entries/6XHZCb9W40GAYkAAWwqzVM
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-98-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 5/5 Pass

---

## Resumen por caso

### 1. [SUFI-98] [AC1] — El or-comparative-card renderiza individualmente dentro del or-multicolumn-container sin errores
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de prueba en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev accesible en el navegador con DevTools abierto en la pestaña Console; la entry del or-comparative-card en Contentful configurada y publicada en el ambiente de desarrollo
- **WHEN** navegar a la URL de la página de prueba y desplazarse hasta la sección comparative cards; observar el componente or-comparative-card renderizado dentro del or-multicolumn-container; revisar la consola en busca de errores relacionados con el renderer del componente
- **THEN** el or-comparative-card se visualiza correctamente como parte del or-multicolumn-container en la sección comparative cards; el componente muestra su contenido sin elementos rotos ni ausentes; la consola no reporta errores relacionados con el renderer del or-comparative-card
- **Esperado:** el or-comparative-card renderiza correctamente de forma individual dentro del or-multicolumn-container en la página de prueba sin errores de consola

---

### 2. [SUFI-98] [AC2] — El or-comparative-card-container valida que soporta entre 2 y 3 entries sin errores
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de prueba en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev con el or-comparative-card-container visible dentro del or-multicolumn-container en la sección comparative cards; DevTools abierto en la pestaña Console
- **WHEN** contar el número de or-comparative-card entries visibles dentro del contenedor; verificar que la cantidad está entre 2 y 3 tarjetas; revisar la consola para confirmar que no se reportan errores de validación relacionados con el número de entries del or-comparative-card-container
- **THEN** el or-comparative-card-container muestra correctamente entre 2 y 3 tarjetas comparativas sin errores; las tarjetas se distribuyen dentro del multicolumn sin desbordamiento ni solapamiento; la consola no reporta errores de validación relacionados con el número de entries
- **Esperado:** el or-comparative-card-container acepta y muestra correctamente entre 2 y 3 entries dentro del or-multicolumn-container sin errores de validación ni de consola

---

### 3. [SUFI-98] [AC3] — El campo Columns To Occupy (Mobile) modifica el ancho del or-comparative-card en vista móvil
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la entry del or-comparative-card en Contentful (Development) accesible; la página de prueba abierta en paralelo con DevTools en Device Toolbar configurada en 375px
- **WHEN** en Contentful anotar el valor actual del campo Columns To Occupy (Mobile); cambiar el valor a una opción diferente y publicar el cambio; recargar la página de prueba y observar el ancho del or-comparative-card dentro del multicolumn en vista móvil de 375px; restaurar el valor original en Contentful tras la validación
- **THEN** al modificar el campo Columns To Occupy (Mobile) el ancho del or-comparative-card en vista móvil (375px) cambia de acuerdo con el número de columnas configurado; la card amplía o reduce su tamaño horizontal respetando la cuadrícula del multicolumn; no se presentan errores de consola ni elementos rotos al cambiar el valor del campo
- **Esperado:** el campo Columns To Occupy (Mobile) en Contentful modifica correctamente el ancho del or-comparative-card en vista móvil (375px) sin errores ni elementos rotos

---

### 4. [SUFI-98] [AC4] — Los campos Columns To Occupy modifican el ancho del or-comparative-card en vista desktop y tablet
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la entry del or-comparative-card en Contentful (Development) accesible; la página de prueba abierta en paralelo con DevTools en Device Toolbar configurada en 1280px (desktop)
- **WHEN** en Contentful localizar los campos Columns To Occupy correspondientes a desktop y/o tablet; anotar el valor actual y cambiarlo a una opción diferente; publicar el cambio; recargar la página de prueba y observar el ancho del or-comparative-card en vista desktop (1280px) y tablet (768px); restaurar los valores originales en Contentful tras la validación
- **THEN** al modificar los campos Columns To Occupy para desktop/tablet el ancho del or-comparative-card cambia de acuerdo con el número de columnas configurado en los respectivos viewports; la card amplía o reduce su tamaño horizontal respetando la cuadrícula del multicolumn; no se presentan errores de consola ni elementos rotos al cambiar los valores
- **Esperado:** los campos Columns To Occupy para desktop/tablet en Contentful modifican correctamente el ancho del or-comparative-card en viewports de 1280px y 768px sin errores ni elementos rotos

---

### 5. [SUFI-98] [AC5] — El or-comparative-card dentro del or-multicolumn-container es responsivo en viewports de tablet y móvil
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de prueba en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev accesible en el navegador con DevTools abierto en la pestaña Device Toolbar; el or-comparative-card visible dentro del or-multicolumn-container en la sección comparative cards
- **WHEN** configurar el viewport a 768px de ancho (tablet) y observar el or-comparative-card y su distribución dentro del multicolumn; a continuación configurar el viewport a 375px de ancho (móvil) y observar nuevamente el componente y su layout
- **THEN** en viewport tablet (768px) el or-comparative-card adapta su ancho y layout dentro del or-multicolumn-container sin desbordamientos horizontales ni elementos rotos; en viewport móvil (375px) el or-comparative-card se muestra correctamente sin desbordamiento horizontal, elementos truncados ni contenido inaccesible; en ambos viewports el contenido de la tarjeta es visible y legible
- **Esperado:** el or-comparative-card dentro del or-multicolumn-container se adapta correctamente a viewports de tablet (768px) y móvil (375px) sin desbordamientos, elementos rotos ni contenido inaccesible

---

## Notas

- AC1–AC5 ejecutados y aprobados sin incidencias en el entorno DEV.
- Validaciones de Columns To Occupy (AC3 y AC4) realizadas modificando y restaurando los valores en Contentful Development en cada iteración.
- Evidencia visual (render del comparative-card, consola limpia, viewports 375px, 768px y 1280px) adjunta directamente al ticket de Jira.
