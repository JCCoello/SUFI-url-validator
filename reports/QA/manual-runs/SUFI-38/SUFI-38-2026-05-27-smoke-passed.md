# SUFI-38 — Manual Smoke (run log)

- **Fecha:** 2026-05-27
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook: https://sufi-acl.vercel.app/?path=/story/atoms-icon--home
  - Preview (test-dev): https://sufi-app.vercel.app/test-dev
  - Contentful: campo `Background Color`
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-38-TESTMO-MANUAL-SMOKE.csv`
- **Folder Testmo:** SUFI-38 - Manual Smoke
- **Resultado global:** ✅ 7/7 Pass

---

## Resumen por caso

### 1. Variantes existentes del at-icon se mantienen disponibles tras la actualización
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el listado previo de variantes de color de fondo y borde del at-icon y la historia https://sufi-acl.vercel.app/?path=/story/atoms-icon--home
- **WHEN** comparar las variantes expuestas por los controls del componente contra el listado previo
- **THEN** inspeccionar el catálogo de variantes disponibles
- **Esperado:** todas las variantes de fondo y borde del listado previo siguen seleccionables en el at-icon sin opciones removidas ni renombradas
- **Observado (2026-05-27):** verificado en Storybook — todas las variantes de fondo y borde del listado previo siguen seleccionables sin opciones removidas ni renombradas

---

### 2. Variantes de color de fondo aplican los nuevos valores de la paleta
**Prioridad:** Critical · **Resultado:** ✅ Pass

- **GIVEN** el at-icon en https://sufi-acl.vercel.app/?path=/story/atoms-icon--home con cada variante de fondo seleccionada por turno
- **WHEN** inspeccionar el color de fondo con DevTools
- **THEN** comparar el valor de color contra el token nuevo de cada variante
- **Esperado:** cada variante de fondo del at-icon coincide con el nuevo valor de la paleta sin valores antiguos remanentes
- **Observado (2026-05-27):** verificado en Storybook con DevTools — cada variante de fondo coincide con el nuevo token de la paleta sin valores antiguos remanentes

---

### 3. Variantes de color de borde aplican los nuevos valores de la paleta
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el at-icon en https://sufi-acl.vercel.app/?path=/story/atoms-icon--home con cada variante de borde seleccionada por turno
- **WHEN** inspeccionar el color de borde con DevTools
- **THEN** comparar el valor de color contra el token nuevo de cada variante
- **Esperado:** cada variante de borde del at-icon coincide con el nuevo valor de la paleta sin valores antiguos remanentes
- **Observado (2026-05-27):** verificado en Storybook con DevTools — cada variante de borde coincide con el nuevo token de la paleta sin valores antiguos remanentes

---

### 4. Contraste entre icono y fondo cumple WCAG AA en todas las variantes
**Prioridad:** Critical · **Resultado:** ✅ Pass

- **GIVEN** el at-icon en https://sufi-acl.vercel.app/?path=/story/atoms-icon--home con cada variante de fondo seleccionada por turno
- **WHEN** medir el contraste entre el color del icono y el color de fondo con una herramienta de accesibilidad
- **THEN** inspeccionar el ratio de contraste reportado para cada variante
- **Esperado:** el ratio de contraste es al menos 3:1 (componente gráfico no textual) cumpliendo WCAG AA en todas las variantes de fondo
- **Observado (2026-05-27):** verificado con herramienta de accesibilidad — el ratio icono/fondo es ≥ 3:1 en todas las variantes cumpliendo WCAG AA

---

### 5. Documentación del at-icon en Storybook muestra las variantes con ejemplos visuales
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** la documentación del at-icon en https://sufi-acl.vercel.app/?path=/story/atoms-icon--home y sus historias relacionadas
- **WHEN** navegar la sección de documentación y los controls del componente
- **THEN** inspeccionar la presencia de un ejemplo visual por cada variante
- **Esperado:** la documentación incluye un ejemplo visual por cada variante de fondo y borde con su nombre y token correspondiente
- **Observado (2026-05-27):** verificado en Storybook — la documentación expone un ejemplo visual por cada variante de fondo y borde con su nombre y token correspondiente

---

### 6. at-icon en el sitio de pruebas refleja las nuevas variantes
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el at-icon renderizado en https://sufi-app.vercel.app/test-dev
- **WHEN** inspeccionar las instancias del componente en la página
- **THEN** comparar los colores de fondo y borde contra los tokens nuevos
- **Esperado:** cada instancia del at-icon en el sitio de pruebas aplica los colores correctos de la paleta actualizada sin colores antiguos remanentes
- **Observado (2026-05-27):** verificado en preview (`/test-dev`) — cada instancia del at-icon aplica los colores correctos de la paleta actualizada sin colores antiguos remanentes

---

### 7. Campo Background Color de Contentful aplica la variante correcta
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** una entrada de Contentful del at-icon con un valor definido en el campo `Background Color` renderizada en https://sufi-app.vercel.app/test-dev
- **WHEN** cambiar el valor del campo a una variante distinta y volver a publicar
- **THEN** inspeccionar el at-icon correspondiente en el sitio de pruebas
- **Esperado:** el at-icon aplica la variante de fondo seleccionada en el campo `Background Color` de Contentful sin requerir cambios de código
- **Observado (2026-05-27):** verificado en preview tras republicar desde Contentful — el at-icon aplica la variante de fondo seleccionada en el campo `Background Color` sin cambios de código

---

## Notas

- Sin defectos encontrados durante esta sesión.
- Evidencia visual (Storybook, preview, DevTools de contraste, Contentful) se adjunta directamente al ticket de Jira.
- Tokens verificados contra la paleta actualizada según el campo `Background Color` definido en Contentful.
