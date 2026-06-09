# SUFI-70 — Manual Smoke (run log)

- **Fecha:** 2026-06-05
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook: https://sufi-acl.vercel.app/?path=/story/organisms-slider--slider-light-mode
  - Preview: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-70-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 8/8 Pass

---

## Resumen por caso

### 1. [SUFI-70] [AC1] — Nuevo campo de scroll horizontal disponible en OrSlider
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el OrSlider en la historia `slider-light-mode` de Storybook
- **WHEN** abrir el panel de controls y localizar la nueva prop de scroll horizontal para ml-contextual-item
- **THEN** inspeccionar que el campo existe en los controls y que al habilitarlo el slider adopta un layout de scroll horizontal con los ml-contextual-item dispuestos en una fila
- **Esperado:** el nuevo campo aparece en los controls del OrSlider y al activarlo el componente presenta los elementos en disposición horizontal sin errores en la consola del navegador

---

### 2. [SUFI-70] [AC2] — Scroll suave con snap points al navegar los elementos del OrSlider
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el OrSlider con scroll horizontal habilitado en la historia `slider-light-mode` de Storybook
- **WHEN** hacer scroll horizontal o swipe horizontal sobre el componente para desplazar los ml-contextual-item
- **THEN** verificar que el scroll se anima de forma suave y se alinea con el snap point del elemento más cercano sin rebote ni salto brusco
- **Esperado:** el OrSlider realiza el desplazamiento con animación fluida y los elementos se alinean correctamente en los snap points sin saltos ni comportamientos inesperados

---

### 3. [SUFI-70] [AC3] — Opción para ocultar los botones de navegación del OrSlider
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** el OrSlider con scroll horizontal habilitado y los botones de navegación visibles
- **WHEN** activar la opción de ocultar botones de navegación en el panel de controls
- **THEN** inspeccionar que los botones anterior y siguiente ya no son visibles en el componente y que el scroll horizontal sigue funcionando mediante gestos o teclado
- **Esperado:** los botones de navegación desaparecen al activar la opción correspondiente y el scroll horizontal continúa operativo a través de otros mecanismos de interacción

---

### 4. [SUFI-70] [AC4] — Soporte de keyboard navigation en el OrSlider con scroll horizontal
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el OrSlider con scroll horizontal habilitado con foco colocado sobre el componente mediante Tab
- **WHEN** presionar las teclas ArrowRight y ArrowLeft para avanzar y retroceder entre los ml-contextual-item
- **THEN** verificar que el slider desplaza su contenido conforme al elemento enfocado y que el indicador de foco visible acompaña a cada elemento activo en todo momento
- **Esperado:** las teclas ArrowRight y ArrowLeft navegan entre los ml-contextual-item del OrSlider y el foco visual se desplaza con cada pulsación sin perder el seguimiento del elemento activo

---

### 5. [SUFI-70] [AC5] — Opción para ocultar el indicador visual de posición (dots/pagination) en OrSlider
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** el OrSlider con el indicador de posición visible (dots o paginación)
- **WHEN** activar la opción de ocultar el indicador de posición en el panel de controls
- **THEN** inspeccionar que el indicador de dots o paginación ya no aparece en el componente y que el layout no presenta huecos ni desalineaciones visibles
- **Esperado:** el indicador de posición se oculta al activar la opción y el componente mantiene su layout sin espaciado residual ni elementos desalineados

---

### 6. [SUFI-70] [AC6] — Comportamiento del OrSlider con scroll horizontal en mobile, tablet y desktop
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el OrSlider con scroll horizontal habilitado en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev
- **WHEN** inspeccionar el componente en viewport mobile (375 px), luego tablet (768 px) y luego desktop (1280 px) usando las DevTools de Chrome
- **THEN** verificar que el scroll horizontal es funcional en los tres breakpoints y que los ml-contextual-item se dimensionan y alinean correctamente sin desbordamiento ni elementos cortados
- **Esperado:** el OrSlider presenta un scroll horizontal funcional en mobile, tablet y desktop con los ml-contextual-item correctamente dimensionados y sin overflow no intencional en ninguna resolución

---

### 7. [SUFI-70] [AC7] — Documentación de integración del OrSlider con scroll horizontal en Storybook
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** la documentación del OrSlider en Storybook
- **WHEN** navegar a la sección Docs del componente y revisar los controls y las historias disponibles
- **THEN** verificar que existe al menos una historia que muestre el scroll horizontal con ml-contextual-item activo y que los nuevos props están descritos en el panel de controls con su tipo y valor por defecto
- **Esperado:** la documentación del OrSlider en Storybook incluye una historia con scroll horizontal activo y los nuevos campos están documentados en el panel de controls con tipos y valores por defecto

---

### 8. [SUFI-70] [AC8] — Verificación de accesibilidad del OrSlider con scroll horizontal
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el OrSlider con scroll horizontal habilitado en la historia `slider-light-mode` de Storybook
- **WHEN** inspeccionar el HTML del componente con DevTools para revisar roles ARIA, ejecutar axe DevTools y navegar el componente únicamente con teclado
- **THEN** verificar que axe no reporta violaciones de nivel A ni AA, que los roles ARIA del slider y los controles de navegación son semánticamente correctos, y que todos los elementos interactivos son alcanzables y operables con teclado
- **Esperado:** axe DevTools no reporta violaciones A/AA en el OrSlider con scroll horizontal; los roles ARIA son apropiados y el componente es completamente operable sin ratón

---

## Notas

- Sin defectos encontrados durante esta sesión.
- Evidencia visual (Storybook controls, DevTools, preview Vercel) adjunta directamente al ticket de Jira.
- Navegación por teclado (ArrowRight/ArrowLeft) verificada en AC4; accesibilidad ARIA y axe DevTools verificados en AC8.
- Comportamiento responsive verificado en tres breakpoints (375 px / 768 px / 1280 px) mediante DevTools de Chrome.
