# SUFI-77 — Manual Smoke (run log)

- **Fecha:** 2026-06-16
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook: https://sufi-acl.vercel.app/
  - App DEV: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-77-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 6/6 Pass — sin defectos encontrados

---

## Resumen por caso

### 1. [SUFI-77] [AC1] — Todos los iconos del ml-directory-card están presentes y alineados según diseño
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el componente ml-directory-card en Storybook en https://sufi-acl.vercel.app/?path=/story/molecules-directory-card--with-zero-phones con el Canvas completamente cargado; Figma abierto en https://www.figma.com/design/pkXFvtuzYHGsMBsHAd9ubO/ como referencia de diseño; DevTools abierto en la pestaña Console
- **WHEN** revisar visualmente cada icono del componente (icono de dirección, teléfono u otros iconos presentes) verificando que todos están presentes y completamente visibles en el Canvas; comparar la posición y apariencia de cada icono con el diseño en Figma; revisar la consola en busca de errores de renderizado relacionados con iconos
- **THEN** todos los iconos del componente ml-directory-card están presentes y completamente visibles; ningún icono aparece truncado, distorsionado ni desplazado respecto al diseño de referencia en Figma; la consola no reporta errores relacionados con el renderizado de iconos
- **Esperado:** todos los iconos del ml-directory-card están presentes y correctamente posicionados según el diseño en Storybook
- **Observado:** todos los iconos visibles, correctamente posicionados, sin truncamientos ni errores de consola

---

### 2. [SUFI-77] [AC2] — Todos los elementos de texto del ml-directory-card están alineados según diseño
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el componente ml-directory-card en Storybook en https://sufi-acl.vercel.app/?path=/story/molecules-directory-card--with-zero-phones con el Canvas completamente cargado; Figma abierto como referencia; DevTools abierto en la pestaña Console
- **WHEN** revisar visualmente cada elemento de texto del componente verificando alineación horizontal y vertical; comparar tipografía, tamaño y posición del texto con el diseño en Figma; revisar la consola en busca de errores de renderizado de texto
- **THEN** todos los elementos de texto del componente ml-directory-card están correctamente alineados horizontal y verticalmente; ningún texto está truncado ni desbordado fuera de su contenedor; la posición y estilo del texto coincide con el diseño de referencia en Figma; la consola no reporta errores relacionados con el renderizado de texto
- **Esperado:** todos los elementos de texto del ml-directory-card están alineados correctamente según el diseño en Storybook
- **Observado:** nombre, dirección y etiquetas alineados correctamente, sin truncamientos ni desbordamientos

---

### 3. [SUFI-77] [AC3] — La alineación vertical de los iconos respecto a sus textos asociados es correcta en ml-directory-card
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el componente ml-directory-card en Storybook en https://sufi-acl.vercel.app/?path=/story/molecules-directory-card--with-zero-phones con el Canvas completamente cargado; DevTools abierto con panel de Elementos activo para inspeccionar estilos CSS de alineación vertical; Figma abierto como referencia
- **WHEN** inspeccionar visualmente la alineación vertical de cada icono respecto a su texto asociado en el Canvas; en DevTools verificar que los contenedores que agrupan icono y texto utilizan la propiedad CSS de alineación vertical (align-items) que coincide con la especificación del diseño; comparar el resultado visual con Figma
- **THEN** cada icono está centrado verticalmente respecto a su texto asociado, sin desplazamiento hacia arriba ni hacia abajo; la alineación vertical de los iconos coincide con el diseño de referencia en Figma; DevTools muestra las propiedades CSS de alineación vertical correctamente aplicadas en todos los pares icono-texto
- **Esperado:** los iconos del ml-directory-card están centrados verticalmente respecto a sus textos asociados según el diseño
- **Observado:** alineación vertical correcta en todos los pares icono-texto confirmada visualmente y en DevTools

---

### 4. [SUFI-77] [AC4] — La alineación horizontal de todos los elementos es correcta en ml-directory-card
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el componente ml-directory-card en Storybook en https://sufi-acl.vercel.app/?path=/story/molecules-directory-card--with-zero-phones con el Canvas completamente cargado; DevTools abierto con panel de Elementos activo para inspeccionar estilos CSS de alineación horizontal; Figma abierto como referencia del caso de uso
- **WHEN** inspeccionar visualmente la alineación horizontal de todos los elementos del componente en el Canvas; en DevTools verificar que el layout horizontal (justify-content, margin, padding) de los contenedores coincide con la especificación del diseño en Figma; comparar el resultado visual con la referencia de caso de uso
- **THEN** todos los elementos del componente ml-directory-card están correctamente alineados horizontalmente dentro del layout; no hay desplazamientos horizontales inesperados ni elementos fuera de la cuadrícula del diseño; el resultado visual coincide con la especificación de caso de uso en Figma
- **Esperado:** todos los elementos del ml-directory-card están correctamente alineados en el eje horizontal según diseño
- **Observado:** layout horizontal consistente con la especificación de Figma, sin desplazamientos

---

### 5. [SUFI-77] [AC5] — El espaciado entre iconos y texto es correcto en ml-directory-card
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el componente ml-directory-card en Storybook en https://sufi-acl.vercel.app/?path=/story/molecules-directory-card--with-zero-phones con el Canvas completamente cargado; DevTools abierto en el panel Computed o Styles para inspeccionar valores de gap o margin entre iconos y textos; Figma abierto con las anotaciones de spacing visibles
- **WHEN** seleccionar en DevTools el contenedor de cada par icono-texto del componente y revisar el valor calculado de gap, margin o padding entre el icono y el texto; comparar cada valor con el espaciado especificado en Figma; verificar que el espaciado es visualmente consistente entre todos los pares icono-texto del componente
- **THEN** el espaciado entre cada icono y su texto asociado coincide con el valor especificado en el sistema de diseño de SuFi; el espaciado es visualmente consistente entre todos los pares icono-texto del componente; no hay espacios excesivos ni insuficientes que rompan la armonía visual del componente
- **Esperado:** el spacing entre iconos y textos del ml-directory-card coincide con las especificaciones del sistema de diseño en Storybook
- **Observado:** spacing consistente en todos los pares icono-texto, alineado con las especificaciones del DS

---

### 6. [SUFI-77] [AC6] — ml-directory-card mantiene la alineación correcta en viewports de tablet (768px) y móvil (375px)
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página DEV https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/ con el componente ml-directory-card visible; DevTools abierto con Device Toolbar activa
- **WHEN** configurar el viewport a 768px de ancho (tablet) y verificar que los iconos están correctamente alineados vertical y horizontalmente, el spacing entre iconos y textos se mantiene, y no hay desbordamiento horizontal ni contenido desalineado; revisar la consola; a continuación configurar el viewport a 375px de ancho (móvil) y repetir las mismas verificaciones
- **THEN** en viewport tablet (768px) el ml-directory-card muestra todos los iconos y textos correctamente alineados, sin desbordamiento horizontal ni desalineamiento; en viewport móvil (375px) el componente adapta su layout manteniendo la alineación y el spacing correcto entre iconos y textos; en ambos viewports la consola no reporta errores relacionados con el componente
- **Esperado:** el ml-directory-card mantiene la alineación correcta de iconos y textos en viewports de tablet (768px) y móvil (375px)
- **Observado:** layout correcto en ambos viewports, sin desbordamiento ni desalineamientos; consola sin errores

---

## Notas

- Sesión de verificación de diseño rápida. Sin defectos encontrados.
- Todos los ACs verificados visualmente en Storybook (AC1–AC5) y en DEV con Device Toolbar (AC6).
