# SUFI-78 — Manual Smoke (run log)

- **Fecha:** 2026-06-08
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Contentful DEV: https://app.contentful.com/spaces/1bla4bgmu67p/environments/development/entries/bUiVGbTttFNU6Qj9uZSF8
  - App DEV: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/
  - Storybook: https://sufi-acl.vercel.app/?path=/docs/organisms-footer--documentation
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-78-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 8/8 Pass

---

## Resumen por caso

### 1. [SUFI-78] [AC1] — or-footer no referencia sm-menu en Contentful
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la entrada de prueba del componente or-footer en Contentful en https://app.contentful.com/spaces/1bla4bgmu67p/environments/development/entries/bUiVGbTttFNU6Qj9uZSF8
- **WHEN** inspeccionar el campo menuSectionLinks de la entrada y revisar el tipo de contenido referenciado por cada ítem del menú
- **THEN** el campo menuSectionLinks referencia directamente entradas de tipo SmMenuItem sin ningún nivel intermedio de tipo SmMenu; el tipo SmMenu ya no aparece referenciado en ningún campo del or-footer
- **Esperado:** el campo menuSectionLinks no contiene referencias de tipo SmMenu; todas las entradas del campo son SmMenuItem confirmando la eliminación del nivel de anidación

---

### 2. [SUFI-78] [AC2] — menuSectionLinks utiliza SmMenuItem directamente
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la entrada del or-footer en Contentful con el campo menuSectionLinks visible y sus entradas expandidas
- **WHEN** abrir una de las entradas referenciadas en menuSectionLinks y revisar su tipo de contenido en la cabecera de la entrada
- **THEN** el tipo mostrado para la entrada referenciada es SmMenuItem; los campos disponibles corresponden a los de SmMenuItem sin ningún wrapper SmMenu adicional
- **Esperado:** cada entrada referenciada en menuSectionLinks es de tipo SmMenuItem; no existe ninguna referencia de tipo SmMenu en el componente or-footer

---

### 3. [SUFI-78] [AC3] — La funcionalidad del menú del footer se mantiene
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la aplicación SUFI en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/ cargada completamente con el footer visible al desplazar la página hacia abajo
- **WHEN** hacer clic en cada uno de los enlaces presentes en las secciones del menú del footer
- **THEN** cada enlace navega a la URL correcta o abre el recurso correspondiente sin errores; ningún enlace del footer está roto ni redirige a una página de error 404 o pantalla en blanco
- **Esperado:** todos los enlaces del menú del footer responden al clic y redirigen correctamente; la funcionalidad del menú es idéntica a la existente antes del cambio de tipo de componente

---

### 4. [SUFI-78] [AC4] — Todos los estados del menú del footer se visualizan correctamente
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** Storybook en https://sufi-acl.vercel.app/?path=/docs/organisms-footer--documentation con la historia del or-footer desplegada en el canvas
- **WHEN** posicionar el cursor sobre cada ítem del menú del footer para activar el estado hover; luego navegar por los ítems usando la tecla Tab para activar el estado focus en cada uno
- **THEN** el estado hover muestra el estilo visual esperado en cada ítem; el estado focus muestra un indicador de foco visible; ningún ítem presenta estilos rotos o ausentes en alguno de estos estados
- **Esperado:** los estados hover y focus de los ítems del menú del footer se visualizan correctamente según el diseño del sistema; no hay regresiones visuales en ningún estado del menú

---

### 5. [SUFI-78] [AC5] — El footer es navegable por teclado y mantiene marcado semántico correcto
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** la aplicación SUFI en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/ con el footer visible y DevTools abierto en la pestaña Elements
- **WHEN** navegar los elementos del footer usando únicamente las teclas Tab y Shift+Tab; luego inspeccionar en el DOM la estructura semántica de los elementos del menú del footer (nav, ul, li, a)
- **THEN** todos los elementos interactivos del menú del footer son alcanzables mediante Tab; los enlaces tienen texto accesible; el marcado semántico del menú está presente y correcto sin atributos aria rotos. Nota: el orden de tabulación en desktop puede aparecer invertido respecto a mobile debido a la implementación del accordion mobile-first — comportamiento conocido registrado para revisión futura, no atribuible a este cambio
- **Esperado:** todos los elementos interactivos del footer son alcanzables por teclado y el marcado semántico es correcto; el orden de tabulación invertido en desktop es un comportamiento preexistente conocido y no atribuible al cambio de sm-menu a sm-menu-item

---

### 6. [SUFI-78] [AC6] — Storybook documenta el footer con la nueva estructura de componentes
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** Storybook en https://sufi-acl.vercel.app/?path=/docs/organisms-footer--documentation con la pestaña Docs del or-footer visible
- **WHEN** revisar la documentación de las props del componente especialmente los campos relacionados con menuSectionLinks y logo; verificar que los ejemplos o tabla de props reflejan la nueva estructura
- **THEN** la documentación menciona SmMenuItem (no SmMenu) para las secciones del menú; el campo del logo está documentado como logo (no brandLogo); la documentación no contiene referencias a la estructura anterior de anidación
- **Esperado:** la documentación en Storybook del or-footer está actualizada y refleja la nueva estructura sin referencias a SmMenu, brandLogo ni smMedia

---

### 7. [SUFI-78] [AC7] — No hay regresiones visuales en el footer tras el cambio
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** Storybook en https://sufi-acl.vercel.app/?path=/docs/organisms-footer--documentation y la aplicación en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/ ambas accesibles en el navegador
- **WHEN** revisar el footer en Storybook comparando layout, tipografía, colores y espaciado de las secciones del menú con el diseño de referencia; luego revisar el footer en la página Home de la aplicación desplazándose hasta el pie de página
- **THEN** el footer en Storybook y en la aplicación presenta layout, tipografía, colores y espaciado correctos; las secciones del menú y el logo se alinean según el diseño esperado; no hay elementos desplazados, con estilos rotos o visualmente distintos al diseño
- **Esperado:** el footer no presenta regresiones visuales en ninguna sección; el cambio de sm-menu a sm-menu-item y de brandLogo a logo no ha alterado el aspecto visual del componente

---

### 8. [SUFI-78] [AC8] — El logo del footer se visualiza correctamente
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la aplicación SUFI en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/ cargada en el navegador con el footer visible al final de la página; DevTools abierto en la pestaña Network con filtro Img activo
- **WHEN** recargar la página y observar el logo del footer una vez que cargue; revisar en la pestaña Network la solicitud del archivo de imagen del logo
- **THEN** el logo del footer se muestra correctamente con las dimensiones y aspecto esperados sin errores de carga; la solicitud en Network apunta directamente al archivo de imagen sin redirecciones y retorna código 200
- **Esperado:** el logo del footer se visualiza correctamente sin regresiones; el cambio de brandLogo a logo (smMedia → Media) no ha causado ningún fallo en la carga o visualización del logo

---

## Notas

- Sin defectos encontrados durante esta sesión.
- Evidencia visual (Contentful DEV, Storybook, app DEV, DevTools Network) adjunta directamente al ticket de Jira.
- Orden de tabulación invertido en desktop (AC5) confirmado como comportamiento preexistente conocido, no atribuible a este cambio — registrado para revisión futura.
- Verificación de marcado semántico (nav, ul, li, a) y atributos ARIA realizada en AC5.
- Logo del footer verificado mediante DevTools Network (código 200, sin redirecciones) en AC8.
