# SUFI-72 — Manual Smoke (run log)

- **Fecha:** 2026-06-12
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook ACL: https://sufi-acl.vercel.app/
  - Contentful DEV: https://app.contentful.com/spaces/1bla4bgmu67p/environments/development
  - Sitio DEV: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-72-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 8/8 Pass

---

## Resumen por caso

### 1. [SUFI-72] [AC1] — La propiedad fullWidth del AtButton alterna correctamente entre content-width y full-width en Storybook y en Contentful
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el átomo AtButton en Storybook en https://sufi-acl.vercel.app con la historia default cargada y el panel de Controls visible; acceso al ambiente de desarrollo de Contentful con las entradas de ejemplo ContentWidth (https://app.contentful.com/spaces/1bla4bgmu67p/environments/development/entries/6eCvaD7HZFKp7UVdcmVwCO) y FullWidth (https://app.contentful.com/spaces/1bla4bgmu67p/environments/development/entries/4Rk0UZVc9U79gaiUxDpryx)
- **WHEN** en Storybook localizar la prop fullWidth en Controls; activar fullWidth:true y observar el ancho del botón en el canvas; desactivar fullWidth:false y observar el cambio; abrir DevTools en Console para verificar ausencia de errores; luego en Contentful abrir ambas entradas y verificar que el campo Should fill the full width? existe con el valor correcto en cada una (false en ContentWidth y true en FullWidth)
- **THEN** en Storybook el botón ocupa el ancho completo con fullWidth:true y se ajusta al texto con fullWidth:false sin errores de consola; en Contentful el campo Should fill the full width? está presente en AtButton y los valores de las entradas de ejemplo son correctos
- **Esperado:** el botón alterna entre full-width y content-width sin errores de consola; en Contentful el campo Should fill the full width? está presente y configurado correctamente en las entradas ContentWidth y FullWidth

---

### 2. [SUFI-72] [AC2] — ml-card respeta la configuración fullWidth en los actionButtons con uno y dos botones
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** las cuatro variantes de ml-card en Storybook: dos botones FullWidth (https://sufi-acl.vercel.app/?path=/story/molecules-card--default), dos botones ContentWidth (args actionButtons[0].fullWidth:!false;actionButtons[1].fullWidth:!false), un botón FullWidth (args actionButtons[1]:!undefined) y un botón ContentWidth (args actionButtons[0].fullWidth:!false;actionButtons[1]:!undefined); DevTools en Console abierto
- **WHEN** navegar a cada una de las cuatro URLs y observar el ancho de los botones y el layout de la card en cada variante; verificar ausencia de errores de consola en cada caso
- **THEN** en variantes FullWidth los botones ocupan el ancho completo del área de acciones sin desbordamiento; en variantes ContentWidth los botones se ajustan al texto sin huecos ni solapamiento; con un botón la card mantiene el espaciado correcto en ambos modos; la consola no reporta errores en ninguna variante
- **Esperado:** ml-card muestra los actionButtons respetando la configuración fullWidth en las cuatro variantes sin romper el layout de la card en ningún caso

---

### 3. [SUFI-72] [AC3] — ml-bandstrip y ml-contextual-item respetan la configuración fullWidth del AtButton en su prop button
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia de ml-bandstrip en https://sufi-acl.vercel.app/?path=/story/molecules-bandstrip--fixed-default y la historia de ml-contextual-item en https://sufi-acl.vercel.app/?path=/story/molecules-contextual-item--default, ambas con la prop button visible en el panel de Controls
- **WHEN** en ml-bandstrip localizar fullWidth dentro de button en Controls; activar fullWidth:true y observar el layout; desactivar fullWidth:false y comparar; verificar la consola; repetir el mismo proceso en ml-contextual-item
- **THEN** en ml-bandstrip el botón adopta el ancho configurado sin desbordar su contenedor ni romper el layout del componente; en ml-contextual-item ocurre lo mismo; la consola no reporta errores en ninguno de los dos componentes al alternar la propiedad
- **Esperado:** ml-bandstrip y ml-contextual-item muestran el botón respetando la configuración fullWidth sin provocar desbordamientos, solapamientos ni errores de layout en ninguno de los dos modos

---

### 4. [SUFI-72] [AC4] — ml-strip y ml-tooltip respetan la configuración fullWidth del AtButton en su prop button y actionButton
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia de ml-strip en https://sufi-acl.vercel.app/?path=/story/molecules-strip--image-position-start y la historia de ml-tooltip en https://sufi-acl.vercel.app/?path=/story/molecules-tooltip--default, con la prop button (strip) y actionButton (tooltip) visibles en el panel de Controls
- **WHEN** en ml-strip localizar fullWidth dentro de button en Controls; activar fullWidth:true y observar el layout; desactivar fullWidth:false y comparar; verificar la consola; repetir el mismo proceso en ml-tooltip con la prop actionButton
- **THEN** en ml-strip el botón adopta el ancho configurado sin desbordar su contenedor ni romper el layout del strip; en ml-tooltip el actionButton respeta la configuración sin romper el layout del tooltip; la consola no reporta errores en ninguno de los dos componentes al alternar la propiedad
- **Esperado:** ml-strip y ml-tooltip muestran el botón respetando la configuración fullWidth sin provocar desbordamientos, solapamientos ni errores de layout en ninguno de los dos modos

---

### 5. [SUFI-72] [AC5] — or-comparative-card y or-photo-gallery respetan la configuración fullWidth del AtButton
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia de or-comparative-card en https://sufi-acl.vercel.app/?path=/story/organisms-comparative-card--white-primary-variant con la prop actionButton visible y la historia de or-photo-gallery en https://sufi-acl.vercel.app/?path=/story/organisms-photo-gallery--default con la prop button visible (aplica para desktop); ambas con el panel de Controls abierto
- **WHEN** en or-comparative-card localizar fullWidth dentro de actionButton en Controls; activar fullWidth:true y observar el layout; desactivar fullWidth:false y comparar; verificar la consola; repetir el mismo proceso en or-photo-gallery con la prop button
- **THEN** en or-comparative-card el botón adopta el ancho configurado sin romper la grilla comparativa ni el alineamiento de las tarjetas; en or-photo-gallery el botón respeta la configuración sin desbordamiento ni desalineación en la galería; la consola no reporta errores en ninguno de los dos organismos al alternar la propiedad
- **Esperado:** or-comparative-card y or-photo-gallery muestran el AtButton respetando la configuración fullWidth sin romper el layout del organismo en ninguno de los dos modos

---

### 6. [SUFI-72] [AC6] — or-form submitButton alterna entre full-width en móvil y content-width en desktop sin romper el formulario
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia default de or-form en https://sufi-acl.vercel.app/?path=/story/organisms-form--default con el submitButton visible y el panel de Controls abierto; DevTools abierto con Device Toolbar activa (Cmd+Shift+M)
- **WHEN** en viewport desktop (1280px) localizar la prop fullWidth del submitButton en Controls y desactivarla (fullWidth:false); observar que el botón se ajusta al texto sin romper el formulario; configurar el viewport a 375px (móvil) y activar fullWidth:true; observar que el botón ocupa el ancho completo del formulario; verificar la consola en ambas configuraciones
- **THEN** en desktop (1280px) con fullWidth:false el submitButton se ajusta al ancho de su texto sin romper la alineación ni el espaciado del formulario; en móvil (375px) con fullWidth:true el botón ocupa el ancho completo disponible dentro del formulario sin desbordamiento ni solapamiento; la consola no muestra errores en ninguna configuración
- **Esperado:** el submitButton de or-form puede configurarse como full-width en móvil y content-width en desktop de forma independiente sin romper el layout del formulario en ningún viewport

---

### 7. [SUFI-72] [AC7] — Regresión: los componentes consumidores mantienen su comportamiento por defecto tras el refactor
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el sitio de prueba en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev con los componentes consumidores de AtButton cargados en su configuración por defecto; DevTools abierto en la pestaña Console
- **WHEN** recorrer visualmente la página de prueba identificando cada componente que contenga un AtButton (ml-card, ml-bandstrip, ml-strip, or-form, or-comparative-card y similares); verificar que los botones presentan el ancho y alineación esperados según el diseño previo al refactor; revisar la consola en busca de errores relacionados con la prop fullWidth
- **THEN** todos los componentes con AtButton en la página de prueba muestran botones con el ancho por defecto correcto; ningún componente presenta botones desbordados, solapados, demasiado pequeños ni con layout roto; la consola no reporta errores relacionados con la prop fullWidth en ningún componente
- **Esperado:** la implementación existente en el sitio de prueba mantiene el comportamiento visual por defecto de todos los AtButton sin regresiones visibles tras el refactor de fullWidth

---

### 8. [SUFI-72] [AC8] — El AtButton configurado como fullWidth es responsivo en viewports de tablet y móvil
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia default de ml-card con dos botones en modo FullWidth en https://sufi-acl.vercel.app/?path=/story/molecules-card--default con DevTools abierto en la pestaña Device Toolbar (Cmd+Shift+M)
- **WHEN** configurar el viewport a 768px (tablet) y observar los dos botones fullWidth dentro de la card verificando el layout sin desplazamiento horizontal; a continuación configurar el viewport a 375px (móvil) y observar nuevamente los botones y el layout completo de la card
- **THEN** en viewport tablet (768px) los botones fullWidth se adaptan al ancho del contenedor de la card sin desbordamiento horizontal ni solapamiento; en viewport móvil (375px) los botones fullWidth respetan el ancho disponible manteniendo el layout correcto sin texto truncado, elementos rotos ni desbordamiento horizontal
- **Esperado:** los AtButton configurados como fullWidth dentro de ml-card se adaptan correctamente al ancho del contenedor en viewports de tablet (768px) y móvil (375px) sin desbordamiento, solapamiento ni contenido inaccesible

---

## Notas

- AC1–AC8 ejecutados y aprobados sin incidencias.
- AC7 verificado en el sitio DEV (`/test-dev`); no se encontraron regresiones en ningún componente consumidor de AtButton.
- Evidencia visual adjunta directamente al ticket de Jira.
