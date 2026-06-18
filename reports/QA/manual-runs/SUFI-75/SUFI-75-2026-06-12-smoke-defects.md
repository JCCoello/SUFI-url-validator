# SUFI-75 — Manual Smoke (run log)

- **Fecha:** 2026-06-12
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Ticket:** [SUFI-75](https://reigncl.atlassian.net/browse/SUFI-75) — `[or-modal]` Integración AtPdfViewer, apertura automática y disposición responsive de botones
- **Entorno:**
  - Preview (test-dev): https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev
  - Contentful (entry modal): https://app.contentful.com/spaces/1bla4bgmu67p/environments/development/entries/6EP7hQDjc3SnDTGJfcIF6S
  - Storybook: https://sufi-acl.vercel.app/?path=/story/organisms-modal--with-pdf-viewer
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-75-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ⚠️ 5/8 Pass · 3/8 Fail — 2 defectos identificados

---

## Defectos registrados

| # | AC(s) afectados | Descripción |
|---|-----------------|-------------|
| DEF-1 | AC3, AC8 | En viewport de 768px (tablet) los botones del modal permanecen en fila horizontal en lugar de apilarse verticalmente cuando `Button Position = responsive`. El comportamiento correcto sí se observa en 375px (mobile). |
| DEF-2 | AC7 | El elemento `<dialog role="dialog">` no incluye el atributo `aria-modal="true"`, requerido por el criterio de accesibilidad del AC. El `aria-labelledby` sí está presente y referencia correctamente al título del modal. |

---

## Resumen por caso

### 1. [SUFI-75] [AC1] — El modal or-modal integra y muestra el componente AtPdfViewer cuando el campo File está configurado
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de prueba https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev cargada en el navegador y el modal or-modal configurado en Contentful con un archivo PDF en el campo File
- **WHEN** la página carga y el modal se despliega automáticamente (ver AC2); se observa el contenido interno del modal
- **THEN** el modal muestra el componente AtPdfViewer integrado en el cuerpo del modal con el contenido del PDF visible (documento Lorem ipsum con texto y gráficos); no se observan errores críticos en consola relacionados con la carga del componente; el título del modal ("Modal Title"), el botón de cierre (×) y los botones de acción ("Call to action") permanecen visibles y funcionales
- **Esperado:** el modal or-modal muestra correctamente el componente AtPdfViewer con el PDF cargado sin errores, manteniendo los demás elementos del modal funcionales
- **Nota:** el modal se abre automáticamente al cargar la página (sin interacción del usuario); no existe un elemento activador de tipo botón. El paso WHEN del caso de prueba original que indica "hacer clic en el elemento que lo activa" no aplica en la configuración actual.

---

### 2. [SUFI-75] [AC2] — El modal se abre automáticamente al cargar la página cuando el campo Should Start Open? está activo
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el modal or-modal configurado en Contentful con el campo Should Start Open? activado; navegar a https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev
- **WHEN** la página carga completamente sin realizar ninguna interacción
- **THEN** el modal aparece automáticamente sin acción del usuario; el overlay de fondo bloquea el contenido de la página; el modal muestra su contenido configurado (título, visor PDF, botones de acción)
- **Esperado:** el modal or-modal se abre automáticamente al cargar la página sin necesidad de interacción del usuario, mostrando su contenido configurado correctamente

---

### 3. [SUFI-75] [AC3] — Los botones del modal se apilan verticalmente en mobile y tablet cuando Button Position es responsive
**Prioridad:** High · **Resultado:** ❌ Fail

- **GIVEN** el modal or-modal con Button Position en responsive y dos botones configurados; página de prueba accesible con DevTools en modo Device Toolbar
- **WHEN** se configura el viewport a 375px (mobile) y se observa la disposición de los botones; luego se repite con 768px (tablet)
- **THEN**
  - 375px (mobile): ✅ los botones se muestran apilados en columna vertical, uno debajo del otro, ocupando el ancho del modal
  - 768px (tablet): ❌ los botones permanecen en fila horizontal lado a lado — no se apilan verticalmente como requiere el criterio
- **Esperado:** en viewports de mobile (375px) y tablet (768px) los botones del modal se apilan verticalmente cuando Button Position es responsive
- **Defecto:** DEF-1 — comportamiento correcto solo en 375px; falla en 768px

---

### 4. [SUFI-75] [AC4] — Los botones del modal se muestran en fila horizontal en desktop cuando Button Position es responsive
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el modal or-modal con Button Position en responsive y dos botones configurados; viewport configurado a 1280px (desktop)
- **WHEN** el modal se despliega automáticamente al cargar la página y se observa la disposición de los botones en el área inferior del modal
- **THEN** los dos botones ("Call to action" — link y button) se muestran en fila horizontal, uno al lado del otro, dentro del contenedor del modal sin desbordamiento
- **Esperado:** en viewport de desktop (≥ 1280px) los botones del modal se muestran en fila horizontal cuando Button Position es responsive

---

### 5. [SUFI-75] [AC5] — El modal or-modal se adapta correctamente en todos los breakpoints
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el modal or-modal configurado con contenido completo (título, PDF y botones) en la página de prueba; DevTools con Device Toolbar activo
- **WHEN** se verifica el layout completo del modal a 375px, 768px, 1024px y 1280px
- **THEN** en todos los breakpoints el modal se muestra correctamente centrado en pantalla; el contenido (título, visor PDF, botones) es visible sin desbordamientos horizontales; el overlay cubre la pantalla completa; no aparecen scrollbars horizontales inesperados ni contenido roto
- **Esperado:** el modal or-modal adapta su layout correctamente en los breakpoints 375px, 768px, 1024px y 1280px sin desbordamientos, elementos solapados ni contenido roto
- **Nota:** la disposición horizontal de los botones en 768px (defecto DEF-1, registrado en AC3) no genera desbordamiento ni contenido roto; los botones son visibles y clicables en todos los viewports evaluados.

---

### 6. [SUFI-75] [AC6] — Las animaciones de transición del modal or-modal funcionan correctamente al abrir y cerrar
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** la página de prueba cargada con el modal or-modal configurado con Should Start Open? activo
- **WHEN** se observa la animación de apertura automática al cargar la página; se presiona Escape para cerrar el modal y se observa la animación de salida
- **THEN** la animación de apertura automática se reproduce de forma suave y progresiva sin saltos ni parpadeos; la animación de cierre al presionar Escape se ejecuta correctamente hasta que el modal desaparece; el overlay aparece y desaparece de forma sincronizada con el modal; no se observan glitches visuales ni estados intermedios incorrectos
- **Esperado:** las animaciones de apertura y cierre del modal or-modal se reproducen de forma fluida y sincronizada sin glitches visuales
- **Nota:** dado que el modal no es invocable mediante botón, solo se pudo evaluar la animación de apertura automática al cargar la página y la animación de cierre vía Escape. La animación de reapertura manual queda fuera del alcance de prueba en la configuración actual.

---

### 7. [SUFI-75] [AC7] — El modal or-modal cumple los criterios de accesibilidad
**Prioridad:** High · **Resultado:** ❌ Fail

- **GIVEN** la página de prueba con el modal or-modal abierto automáticamente al cargar; Chrome DevTools disponible
- **WHEN** se navega por los elementos interactivos del modal usando únicamente el teclado; se verifica que el foco queda atrapado dentro del modal; se presiona Escape para cerrar el modal; se inspeccionan los atributos ARIA del elemento dialog en DevTools
- **THEN**
  - ✅ El foco se mueve de forma lógica entre los 3 elementos interactivos del modal: botón de cierre (×), "Call to action" (link), "Call to action" (button)
  - ✅ El foco queda atrapado dentro del modal mientras está abierto (confirmado con 4 pulsaciones de Tab, todas con `insideDialog: true`)
  - ✅ La tecla Escape cierra el modal correctamente (`display: none` verificado post-Escape)
  - ⚠️ Retorno de foco al elemento activador: N/A — el modal se abre automáticamente sin elemento activador; no existe elemento al que devolver el foco
  - ✅ `role="dialog"` presente en el elemento dialog
  - ✅ `aria-labelledby` presente y referenciando el título del modal
  - ❌ `aria-modal` ausente — el atributo `aria-modal="true"` no está definido en el elemento dialog
  - ⚠️ Auditoría axe DevTools no ejecutada en esta sesión
- **Esperado:** el modal es totalmente accesible por teclado con focus trap correcto, Escape funcional, roles ARIA apropiados y sin violaciones críticas
- **Defecto:** DEF-2 — falta atributo `aria-modal="true"` en `<dialog role="dialog">`

---

### 8. [SUFI-75] [AC8] — El modal or-modal funciona correctamente en dispositivos tablet y móvil
**Prioridad:** High · **Resultado:** ❌ Fail

- **GIVEN** la página de prueba accesible en dispositivo móvil emulado (375px) y tablet emulado (768px); modal configurado con PDF, Should Start Open? activo y Button Position en responsive
- **WHEN** se carga la página en 375px y se verifica apertura automática, PDF, botones apilados y respuesta al toque; se repite en 768px
- **THEN**
  - 375px (mobile): ✅ modal se abre automáticamente al cargar; ✅ visor PDF visible sin desbordamiento; ✅ botones apilados en columna vertical; ✅ layout correcto sin glitches
  - 768px (tablet): ✅ modal se abre automáticamente al cargar; ✅ visor PDF visible sin desbordamiento; ❌ botones no apilados — permanecen en fila horizontal
- **Esperado:** el modal or-modal y todas sus nuevas funcionalidades operan correctamente en dispositivos tablet y móvil con interacción táctil
- **Defecto:** DEF-1 (mismo que AC3) — disposición horizontal de botones en 768px en lugar de apilarse verticalmente

---

## Notas

- El modal no está invocado por un botón sino que se abre automáticamente al renderizar la página (`Should Start Open? = true`). Esto afecta los pasos WHEN de AC1, AC6 y AC7 que hacen referencia a "hacer clic en el elemento que lo activa" — ajustado en cada caso de esta ejecución.
- Evidencia visual (screenshots de viewports 375px, 768px, 1024px y 1280px) disponible en sesión de prueba.
- DEF-1 (botones tablet) y DEF-2 (`aria-modal` ausente) pendientes de registro en Jira como defectos vinculados a SUFI-75.
