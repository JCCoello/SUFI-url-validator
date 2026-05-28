# SUFI-37 — Manual Smoke (run log)

- **Fecha:** 2026-05-28
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook: https://sufi-acl.vercel.app/?path=/docs/atoms-button--documentation
  - Preview: https://sufi-app.vercel.app/
  - Figma: 🔴 DS SuFi — v1.0 (`node-id=12-366`)
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-37-TESTMO-MANUAL-SMOKE.csv`
- **Folder Testmo:** SUFI-37 - Manual Smoke
- **Resultado global:** ✅ 8/8 Pass

---

## Resumen por caso

### 1. Variantes existentes del at-button se mantienen disponibles tras la actualización
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el listado previo de variantes del at-button y la documentación en https://sufi-acl.vercel.app/?path=/docs/atoms-button--documentation
- **WHEN** comparar las variantes expuestas por los controls del componente contra el listado previo
- **THEN** inspeccionar el catálogo de variantes disponibles
- **Esperado:** todas las variantes del listado previo siguen seleccionables en el at-button sin opciones removidas ni renombradas
- **Observado (2026-05-28):** verificado en Storybook — todas las variantes del listado previo (primary, secondary, tertiary, etc.) siguen seleccionables sin opciones removidas ni renombradas

---

### 2. Colores de todas las variantes del at-button aplican los nuevos valores de la paleta
**Prioridad:** Critical · **Resultado:** ✅ Pass

- **GIVEN** el at-button en https://sufi-acl.vercel.app/?path=/docs/atoms-button--documentation con cada variante seleccionada por turno
- **WHEN** inspeccionar el color de fondo, el color de texto y el color de borde con DevTools
- **THEN** comparar los valores de color contra los tokens nuevos definidos en Figma (DS v1.0 `node-id=12-366`)
- **Esperado:** cada variante del at-button aplica los nuevos valores de color de la propuesta de diseño sin valores antiguos remanentes
- **Observado (2026-05-28):** verificado en Storybook con DevTools — cada variante aplica los nuevos tokens de fondo, texto y borde del DS v1.0 sin valores antiguos remanentes

---

### 3. Padding interno del at-button consistente en todas las variantes
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el at-button en https://sufi-acl.vercel.app/?path=/docs/atoms-button--documentation con cada variante seleccionada por turno
- **WHEN** inspeccionar los valores de padding del botón con DevTools
- **THEN** comparar el padding horizontal y vertical contra la especificación en Figma (DS v1.0 `node-id=12-366`)
- **Esperado:** el padding interno del at-button coincide con la nueva especificación y es consistente entre todas las variantes
- **Observado (2026-05-28):** verificado en Storybook con DevTools — el padding horizontal y vertical coincide con la especificación del DS v1.0 y se mantiene consistente entre variantes

---

### 4. Tipografía del at-button coincide con las nuevas especificaciones
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el at-button en https://sufi-acl.vercel.app/?path=/docs/atoms-button--documentation con cada variante seleccionada por turno
- **WHEN** inspeccionar font-size, font-weight y line-height del label del botón con DevTools
- **THEN** comparar los valores tipográficos contra la especificación en Figma (DS v1.0 `node-id=12-366`)
- **Esperado:** el at-button aplica el peso y tamaño tipográfico definidos en la nueva propuesta sin valores antiguos remanentes
- **Observado (2026-05-28):** verificado en Storybook con DevTools — font-size, font-weight y line-height coinciden con la especificación del DS v1.0 sin valores antiguos remanentes

---

### 5. Efectos visuales del at-button (sombra y borde) reflejan el nuevo estilo
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** el at-button en https://sufi-acl.vercel.app/?path=/docs/atoms-button--documentation con cada variante seleccionada por turno
- **WHEN** inspeccionar box-shadow, border y border-radius con DevTools
- **THEN** comparar los valores contra la especificación en Figma (DS v1.0 `node-id=12-366`)
- **Esperado:** los efectos visuales del at-button coinciden con la nueva especificación de sombra y borde en todas las variantes
- **Observado (2026-05-28):** verificado en Storybook con DevTools — box-shadow, border y border-radius coinciden con la nueva especificación en todas las variantes

---

### 6. Contraste entre texto y fondo del at-button cumple WCAG AA en todas las variantes
**Prioridad:** Critical · **Resultado:** ✅ Pass

- **GIVEN** el at-button en https://sufi-acl.vercel.app/?path=/docs/atoms-button--documentation con cada variante seleccionada por turno
- **WHEN** medir el contraste entre el color del texto y el color de fondo con una herramienta de accesibilidad
- **THEN** inspeccionar el ratio de contraste reportado para cada variante
- **Esperado:** el ratio de contraste es al menos 4.5:1 cumpliendo WCAG AA en todas las variantes del at-button
- **Observado (2026-05-28):** verificado con herramienta de accesibilidad — el ratio texto/fondo es ≥ 4.5:1 en todas las variantes cumpliendo WCAG AA

---

### 7. at-button se comporta correctamente en formularios, navs y modales en el sitio de pruebas
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** instancias del at-button renderizadas dentro de formularios, navs y modales en https://sufi-app.vercel.app/
- **WHEN** inspeccionar cada contexto en el sitio y comparar el estilo del botón contra la especificación
- **THEN** inspeccionar colores, padding, tipografía y efectos visuales en cada contexto
- **Esperado:** el at-button conserva los nuevos estilos y se integra correctamente en formularios, navs y modales sin colisiones de layout ni estilos antiguos remanentes
- **Observado (2026-05-28):** verificado en preview — el at-button conserva colores, padding, tipografía y efectos en formularios, navs y modales sin colisiones de layout ni estilos antiguos remanentes

---

### 8. Documentación del at-button en Storybook muestra las variantes con ejemplos visuales
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** la documentación del at-button en https://sufi-acl.vercel.app/?path=/docs/atoms-button--documentation y sus historias relacionadas
- **WHEN** navegar la sección de documentación y los controls del componente
- **THEN** inspeccionar la presencia de un ejemplo visual por cada variante
- **Esperado:** la documentación incluye un ejemplo visual por cada variante del at-button con su nombre y token correspondiente
- **Observado (2026-05-28):** verificado en Storybook — la documentación expone un ejemplo visual por cada variante con su nombre y token correspondiente

---

## Notas

- Sin defectos encontrados durante esta sesión.
- Evidencia visual (Storybook, preview, DevTools de contraste, Figma DS v1.0) se adjunta directamente al ticket de Jira.
- Tokens verificados contra Figma 🔴 DS SuFi — v1.0 (`node-id=12-366`).
