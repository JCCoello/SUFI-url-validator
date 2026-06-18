# SUFI-74 — Manual Smoke (run log)

- **Fecha:** 2026-06-10
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook ACL: https://sufi-acl.vercel.app/
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-74-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 6/6 Pass

---

## Resumen por caso

### 1. [SUFI-74] [AC1] — El componente AtPdfViewer se crea y renderiza correctamente en su estado sin acciones
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia de Storybook without-actions del componente AtPdfViewer en https://sufi-acl.vercel.app/?path=/story/atoms-pdfviewer--without-actions accesible en el navegador
- **WHEN** navegar a la URL de Storybook, esperar que la historia cargue completamente y observar el componente renderizado en el canvas; abrir DevTools en la pestaña Console para revisar errores relacionados con la carga del componente
- **THEN** el componente AtPdfViewer se renderiza correctamente en el canvas de Storybook mostrando el contenido del PDF cargado; no aparecen controles de navegación ni de zoom en la variante sin acciones; la consola no muestra errores críticos relacionados con la carga o montaje del componente
- **Esperado:** el componente AtPdfViewer se renderiza sin errores en su estado básico mostrando el PDF sin controles adicionales

---

### 2. [SUFI-74] [AC2] — La carga de PDFs desde URL funciona correctamente
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia de Storybook without-actions del componente AtPdfViewer en https://sufi-acl.vercel.app/?path=/story/atoms-pdfviewer--without-actions con el componente visible en el canvas
- **WHEN** observar el comportamiento de carga del PDF en el componente; verificar en DevTools (pestaña Network) que la solicitud a la URL del PDF se realiza y recibe una respuesta exitosa; esperar a que el contenido del PDF sea visible en el visor
- **THEN** el PDF cargado desde URL se muestra correctamente en el visor; la primera página del documento es visible sin errores visuales; la pestaña Network muestra una respuesta HTTP exitosa para la URL del PDF; no se muestra ningún mensaje de error de carga en el componente
- **Esperado:** el componente AtPdfViewer carga y muestra correctamente el PDF desde la URL configurada sin errores de red ni de renderizado

---

### 3. [SUFI-74] [AC3] — Los controles de navegación (página anterior y siguiente) funcionan correctamente
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia de Storybook navigation-only del componente AtPdfViewer en https://sufi-acl.vercel.app/?path=/story/atoms-pdfviewer--navigation-only con el PDF cargado y los botones de navegación visibles en el canvas
- **WHEN** hacer clic en el botón de página siguiente para avanzar al menos dos páginas; a continuación hacer clic en el botón de página anterior para retroceder una página; observar el cambio de página y el indicador de página actual en cada acción
- **THEN** al hacer clic en página siguiente el visor muestra la página siguiente del PDF correctamente; al hacer clic en página anterior el visor retrocede a la página anterior; el indicador de página actual se actualiza en cada navegación; los botones se deshabilitan correctamente en la primera y última página del documento
- **Esperado:** los controles de navegación permiten avanzar y retroceder páginas del PDF correctamente con el indicador de página actual actualizado en cada acción

---

### 4. [SUFI-74] [AC4] — La funcionalidad de zoom (acercar y alejar) funciona correctamente
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia de Storybook scale-only del componente AtPdfViewer en https://sufi-acl.vercel.app/?path=/story/atoms-pdfviewer--scale-only con el PDF cargado y los botones de zoom visibles en el canvas
- **WHEN** hacer clic en el botón de zoom in (acercar) al menos dos veces observando el cambio de escala; a continuación hacer clic en el botón de zoom out (alejar) al menos dos veces observando la reducción de escala
- **THEN** al hacer clic en zoom in el PDF aumenta su tamaño de visualización de forma progresiva y visible; al hacer clic en zoom out el PDF reduce su tamaño de forma progresiva y visible; el indicador de nivel de zoom (si existe) se actualiza en cada acción; los botones se deshabilitan correctamente en los límites mínimo y máximo de zoom
- **Esperado:** los controles de zoom permiten acercar y alejar el PDF correctamente con cambios de escala visibles y progresivos en cada acción

---

### 5. [SUFI-74] [AC5] — El visor de PDFs AtPdfViewer cumple los criterios de accesibilidad
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia de Storybook navigation-only del componente AtPdfViewer en https://sufi-acl.vercel.app/?path=/story/atoms-pdfviewer--navigation-only con el PDF cargado y los controles de navegación visibles; DevTools abierto en la pestaña Accessibility o con axe DevTools instalado
- **WHEN** navegar por los controles del componente usando únicamente el teclado (Tab para moverse entre elementos, Enter o Space para activarlos); revisar en DevTools o axe que los botones de navegación y zoom tengan atributos aria-label o texto visible que identifique su función; verificar que no existan violaciones críticas de accesibilidad reportadas por la herramienta
- **THEN** todos los controles interactivos del visor son alcanzables y activables con teclado sin trampa de foco; cada botón tiene un aria-label descriptivo o texto visible que identifica su función; la herramienta de accesibilidad no reporta violaciones críticas relacionadas con el componente; el visor cuenta con rol ARIA apropiado o estructura semántica correcta
- **Esperado:** el componente AtPdfViewer es navegable por teclado y sus controles interactivos tienen etiquetas accesibles sin violaciones críticas de accesibilidad

---

### 6. [SUFI-74] [AC6] — El uso del componente AtPdfViewer está documentado en Storybook
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** la historia de Storybook without-actions del componente AtPdfViewer en https://sufi-acl.vercel.app/?path=/story/atoms-pdfviewer--without-actions accesible en el navegador
- **WHEN** hacer clic en la pestaña Docs en la barra superior de Storybook para acceder a la documentación del componente; revisar el contenido de la página de documentación incluyendo descripción del componente, tabla de props (Controls) e historias de ejemplo disponibles (without-actions, navigation-only, scale-only)
- **THEN** la página de documentación está disponible y cargada sin errores; la descripción del componente AtPdfViewer es visible y comprensible; la tabla de props muestra al menos las propiedades principales del componente (URL del PDF, habilitación de controles); las tres historias principales están listadas y accesibles desde la documentación
- **Esperado:** la documentación del componente AtPdfViewer en Storybook está disponible con descripción, tabla de props y las historias de ejemplo

---

## Notas

- AC1–AC6 ejecutados y aprobados sin incidencias en el entorno Storybook ACL.
- AC7 (responsividad en viewports tablet y móvil) eliminado del alcance — aplica únicamente a Storybook y fue descartado durante la ejecución por no ser relevante para el ciclo de prueba del componente átomo en su contexto actual.
- Evidencia visual adjunta directamente al ticket de Jira.
