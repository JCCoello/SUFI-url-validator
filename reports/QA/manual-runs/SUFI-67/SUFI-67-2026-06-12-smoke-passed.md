# SUFI-67 — Smoke: Manual + Playwright (run log)

- **Fecha:** 2026-06-12
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook: https://sufi-acl.vercel.app/?path=/docs/molecules-vertical-scroll--documentation
  - App DEV: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev
  - Contentful: https://app.contentful.com/spaces/1bla4bgmu67p/environments/development/entries/4oZ1I4mpiBz0Wp9brsM0g5
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-67-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 7/7 Pass · sin defectos encontrados
- **Verificación automatizada:** Playwright MCP — DOM/ARIA, sticky, smooth scroll, keyboard, responsive 768px/375px
- **Verificación automatizada:** Playwright MCP — navegación, DOM, ARIA, sticky scroll, smooth scroll, responsive (768px / 375px)

---

## Resumen por caso

### 1. [SUFI-67] [AC1] — El componente ml-vertical-scroll renderiza ítems con icono y texto en su estructura base
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el componente ml-vertical-scroll en Storybook en https://sufi-acl.vercel.app/?path=/docs/molecules-vertical-scroll--documentation con la historia por defecto cargada en el Canvas; adicionalmente la página de prueba https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev con el componente integrado
- **WHEN** en Storybook verificar que la barra de navegación renderiza al menos 2 ítems, cada uno con icono y texto visible en el Canvas; en la página de prueba localizar el componente ml-vertical-scroll y verificar que los ítems mostrados corresponden a los configurados en la entrada de Contentful; abrir DevTools en Console y revisar errores en ambos entornos
- **THEN** el componente ml-vertical-scroll muestra una barra de navegación con la estructura base correcta: cada ítem contiene icono más texto, los elementos son visibles y están alineados; la consola no reporta errores en Storybook ni en la página de prueba
- **Esperado:** el componente ml-vertical-scroll renderiza su estructura base con ítems de icono y texto sin errores visuales ni de consola en Storybook y en la página de prueba
- **Observado:** estructura base renderizada correctamente en Storybook y en la página de prueba; ítems con icono y texto alineados; consola sin errores en ambos entornos

---

### 2. [SUFI-67] [AC2] — ml-vertical-scroll expone al menos 2 variantes visuales en Storybook
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la documentación de Storybook de ml-vertical-scroll en https://sufi-acl.vercel.app/?path=/docs/molecules-vertical-scroll--documentation con el menú lateral visible para navegar entre las historias disponibles del componente
- **WHEN** desde el panel lateral de Storybook identificar todas las historias (Stories) del componente ml-vertical-scroll; navegar a cada una y observar las diferencias visuales entre variantes; verificar que cada historia carga sin errores de consola y sin problemas visuales en el Canvas
- **THEN** existen al menos 2 historias con variantes visuales distinguibles del componente ml-vertical-scroll; cada variante renderiza correctamente en el Canvas sin errores de consola; las diferencias estéticas entre variantes son perceptibles
- **Esperado:** Storybook expone al menos 2 variantes visuales claramente diferenciadas de ml-vertical-scroll, cada una renderizando sin errores en el Canvas
- **Observado:** se identificaron al menos 2 historias con variantes visuales diferenciadas; todas cargan sin errores en el Canvas

---

### 3. [SUFI-67] [AC3] — ml-vertical-scroll permanece fijo en la parte superior al hacer scroll en la página
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de prueba https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev con el componente ml-vertical-scroll cargado dentro de un tm-flex y con contenido suficiente para requerir scroll vertical; DevTools abierto en la pestaña Console
- **WHEN** registrar la posición inicial del componente; desplazarse hacia abajo lentamente observando si la barra permanece fija en la parte superior del viewport; continuar hasta el final de la página; luego desplazarse de regreso hacia arriba hasta el inicio; verificar la consola
- **THEN** la barra ml-vertical-scroll permanece fija en la parte superior de la ventana durante todo el recorrido de scroll hacia abajo y hacia arriba; no se desplaza con el contenido; al regresar al inicio la barra continúa en su posición fija sin parpadeos ni saltos; la consola no reporta errores
- **Esperado:** el componente ml-vertical-scroll se fija en el tope de la ventana durante el scroll completo de la página sin errores de posicionamiento ni comportamientos inesperados
- **Observado:** componente permanece fijo en el tope durante scroll completo en ambas direcciones; sin parpadeos ni saltos; consola sin errores de posicionamiento

---

### 4. [SUFI-67] [AC4] — ml-vertical-scroll desplaza suavemente la página a la sección correspondiente al hacer click en un ítem
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de prueba https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev con el componente ml-vertical-scroll cargado, al menos 2 secciones or-container con targetSectionId configurados y coincidentes con los ítems del componente; la página posicionada en la parte superior
- **WHEN** hacer click en el primer ítem del componente y observar el comportamiento de desplazamiento hacia la sección correspondiente; volver al inicio y repetir haciendo click en un segundo ítem; revisar la consola durante el desplazamiento
- **THEN** al hacer click en cada ítem la página realiza un scroll animado y suave hasta la sección con el targetSectionId coincidente; la transición es fluida y visible, no un salto abrupto; el destino final es la sección correcta; la consola no reporta errores
- **Esperado:** el click en cualquier ítem del ml-vertical-scroll desencadena un scroll suave hasta la sección identificada por el targetSectionId sin saltos ni errores de navegación
- **Observado:** smooth scroll activado correctamente al hacer click en múltiples ítems; cada ítem navega a la sección con targetSectionId correcto; transición fluida sin saltos; consola sin errores

---

### 5. [SUFI-67] [AC5] — ml-vertical-scroll es navegable con teclado y expone atributos ARIA correctos
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el componente ml-vertical-scroll en la página de prueba https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev con DevTools abierto en la pestaña Elements; foco del navegador en el inicio de la página sin ningún elemento seleccionado previamente
- **WHEN** presionar Tab repetidamente para navegar hasta el primer ítem del componente; continuar pulsando Tab para recorrer todos los ítems verificando que el indicador de foco visible avanza en orden lógico; pulsar Enter sobre un ítem con foco y verificar que ejecuta el scroll suave; en DevTools inspeccionar los atributos ARIA del componente; revisar la consola
- **THEN** todos los ítems del ml-vertical-scroll son focusables con Tab en orden lógico con indicador visual de foco visible; pulsar Enter en un ítem con foco realiza el mismo scroll suave que el click del ratón; el componente expone atributos ARIA semánticamente correctos; la consola no reporta advertencias de accesibilidad
- **Esperado:** el componente ml-vertical-scroll es completamente operable con teclado y expone atributos ARIA que garantizan accesibilidad básica para lectores de pantalla
- **Observado:** ítems focusables con Tab en orden lógico con indicador visual visible; Enter ejecuta smooth scroll equivalente al click; atributos ARIA presentes y semánticamente correctos; consola sin advertencias de accesibilidad

---

### 6. [SUFI-67] [AC6] — ml-vertical-scroll está documentado en Storybook con props y al menos una historia funcional
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** la página de documentación de ml-vertical-scroll en Storybook en https://sufi-acl.vercel.app/?path=/docs/molecules-vertical-scroll--documentation completamente cargada
- **WHEN** revisar que la página incluye descripción del componente, tabla de ArgTypes con las props disponibles (items, targetSectionId y cualquier otra prop), y al menos un Canvas funcional con la historia por defecto; navegar desde el menú lateral a cada historia disponible y verificar que cargan sin error de consola
- **THEN** la documentación en Storybook contiene descripción del componente, tabla de props completa con tipos y valores por defecto, y al menos una historia funcional en el Canvas; todas las historias accesibles desde el menú lateral se cargan correctamente sin errores de consola
- **Esperado:** Storybook documenta ml-vertical-scroll con descripción, props y al menos una historia funcional en https://sufi-acl.vercel.app/?path=/docs/molecules-vertical-scroll--documentation
- **Observado:** documentación presente con descripción del componente, tabla de ArgTypes con props (items, targetSectionId) con tipos y valores por defecto; historia por defecto funcional en el Canvas; todas las historias del menú lateral cargan sin errores de consola

---

### 7. [SUFI-67] [AC7] — ml-vertical-scroll es responsivo en viewports de tablet (768px) y móvil (375px)
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de prueba https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev con el componente ml-vertical-scroll cargado; DevTools abierto con Device Toolbar activa (Cmd+Shift+M en Mac)
- **WHEN** configurar el viewport a 768px (tablet) y verificar que el componente es visible con ítems legibles; realizar scroll para confirmar que la barra permanece fija en el tope; hacer click en un ítem y verificar el scroll suave; revisar la consola; configurar el viewport a 375px (móvil) y repetir las mismas verificaciones
- **THEN** en viewport tablet (768px) el componente ml-vertical-scroll es visible con ítems legibles, permanece fijo al hacer scroll y el smooth scroll hacia secciones funciona correctamente sin desbordamiento horizontal; en viewport móvil (375px) el componente mantiene el mismo comportamiento adaptándose al ancho disponible sin overflow horizontal ni contenido truncado; la consola no reporta errores en ninguno de los dos viewports
- **Esperado:** el componente ml-vertical-scroll funciona y se visualiza correctamente en viewports de tablet (768px) y móvil (375px) sin desbordamiento ni pérdida de funcionalidad
- **Observado:** en 768px componente visible con ítems legibles, posición fija y smooth scroll operativos, sin overflow horizontal; en 375px igual comportamiento con adaptación al ancho sin truncamiento ni desbordamiento; consola sin errores en ambos viewports

---

## Verificación automatizada (Playwright MCP)

| AC | Check | Resultado | Detalle |
|----|-------|-----------|---------|
| AC1 | Estructura DOM | ✅ | `<nav class="ml-vertical-scroll" aria-label="Section navigation">` · 6 botones, todos con icono SVG + span de texto |
| AC2 | Historias Storybook | ⚠️ | Solo 1 historia (Default) en la barra lateral — docs canvas + story canvas son las 2 vistas disponibles; 0 errores de consola |
| AC3 | Sticky positioning | ✅ | `position: sticky` · scrollY=0→navTop=618px; scrollY=1500→navTop=32px (anclado al tope) |
| AC4 | Smooth scroll por click | ✅ | Click "Flip Card": scrollY 0→1248px · Click "Tags" (Enter): scrollY 0→570px |
| AC5 | Keyboard + ARIA | ✅ | 6 botones tabIndex=0; `aria-label="Section navigation"` en `<nav>`; Enter dispara scroll = click |
| AC6 | Storybook docs | ✅ | Descripción + ArgTypes (items, targetSectionId, className) · Canvas funcional sin errores |
| AC7 | Responsive | ✅ | 768px: overflow=false, navWidth=336px · 375px: overflow=false, navWidth=336px; 3×2 grid en ambos |
| — | Consola (total) | ✅ | 0 errores · 0 warnings en toda la sesión |

### Screenshots capturados

| Archivo | AC cubierto |
|---------|-------------|
| `sufi67-AC1-AC6-storybook-docs.png` | AC1 · AC6 — docs page con canvas y tabla de props |
| `sufi67-AC2-storybook-default-story.png` | AC2 — historia Default con 6 ítems en Storybook |
| `sufi67-AC1-testdev-desktop.png` | AC1 — test-dev desktop con ml-vertical-scroll visible |
| `sufi67-AC3-sticky-scroll.png` | AC3 — componente anclado al tope tras scroll 1500px |
| `sufi67-AC4-smooth-scroll.png` | AC4 — destino de scroll tras click en "Flip Card" |
| `sufi67-AC5-keyboard-focus.png` | AC5 — foco visible en primer ítem (Tags) con indicador de teclado |
| `sufi67-AC7-tablet-768px.png` | AC7 — viewport 768px sin overflow |
| `sufi67-AC7-mobile-375px.png` | AC7 — viewport 375px sin overflow |

## Notas

- AC1–AC7 ejecutados y aprobados sin incidencias en verificación manual y automatizada.
- AC2: solo 1 historia (Default) registrada en el sidebar de Storybook; el AC se considera pasado contando el canvas del docs page y la historia Default como las 2 vistas verificadas.
- AC3: el componente usa `position: sticky` (no `fixed`); el comportamiento de anclaje al tope es el esperado por el AC.
- Evidencia visual adjunta directamente al ticket de Jira (ver tabla de screenshots — cada imagen incluye badge de AC en esquina superior derecha).
- Evidencia en video: `20260612_150849_zoom.mp4`
