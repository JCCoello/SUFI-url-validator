# SUFI-71 — Manual Smoke (run log)

- **Fecha:** 2026-06-05
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook (organisms): https://sufi-acl.vercel.app/?path=/story/organisms-accordion-container--default
  - Storybook (molecules): https://sufi-acl.vercel.app/?path=/story/molecules-accordion--default
  - Preview: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-71-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 6/6 Pass

---

## Resumen por caso

### 1. [SUFI-71] [AC1] — Scroll horizontal funcional dentro de un ítem abierto del accordion
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** un ítem del accordion abierto con ml-contextual-item y scroll horizontal habilitado en Storybook (`organisms-accordion-container--default`)
- **WHEN** hacer scroll horizontal o swipe sobre el área del ml-contextual-item dentro del ítem del accordion
- **THEN** verificar que el contenido se desplaza horizontalmente de forma suave con snap points funcionales y sin desbordamiento visible
- **Esperado:** el scroll horizontal dentro del accordion funciona con animación fluida y los elementos se alinean en los snap points sin saltos ni overflow no intencional

---

### 2. [SUFI-71] [AC2] — Sin conflictos entre el evento de click del accordion y el scroll horizontal del contenido
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** un accordion con ml-contextual-item y scroll horizontal habilitado con un ítem abierto
- **WHEN** primero hacer scroll horizontal sobre el ml-contextual-item y luego clicar el encabezado del accordion para cerrarlo; repetir la secuencia invirtiendo el orden de las interacciones
- **THEN** verificar que el scroll horizontal se ejecuta sin cerrar el accordion y que el clic en el encabezado abre o cierra el ítem sin disparar un scroll lateral
- **Esperado:** el accordion responde únicamente al clic en su encabezado y el scroll horizontal responde únicamente al gesto de deslizamiento sin que una interacción provoque el comportamiento de la otra

---

### 3. [SUFI-71] [AC3] — Animaciones de apertura y cierre del accordion con contenido de scroll horizontal
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** un accordion con ml-contextual-item y scroll horizontal habilitado con un ítem cerrado
- **WHEN** clicar el encabezado del ítem para abrirlo y observar la animación de expansión; luego clicar nuevamente para cerrarlo y observar la animación de colapso
- **THEN** verificar que ambas animaciones se ejecutan de forma fluida sin cortes ni saltos visuales y que el contenido de scroll horizontal aparece y desaparece correctamente en cada transición
- **Esperado:** las animaciones de apertura y cierre del accordion se reproducen sin interrupciones ni artefactos visuales independientemente del contenido de scroll horizontal que albergue el ítem

---

### 4. [SUFI-71] [AC4] — Accesibilidad de la combinación accordion más scroll horizontal
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el accordion con ml-contextual-item y scroll horizontal habilitado en Storybook (`organisms-accordion-container--default`)
- **WHEN** inspeccionar el HTML con DevTools para revisar roles ARIA del accordion y del scroll; ejecutar axe DevTools; y navegar la combinación completa únicamente con teclado (Tab para cambiar ítem, Enter/Space para abrir, ArrowRight/ArrowLeft para scroll)
- **THEN** verificar que axe no reporta violaciones de nivel A ni AA y que todos los controles del accordion y del scroll horizontal son alcanzables y operables sin ratón
- **Esperado:** axe DevTools no reporta violaciones A/AA en la combinación accordion más scroll horizontal; los roles ARIA son semánticamente correctos y la navegación por teclado es completamente funcional en ambos componentes

---

### 5. [SUFI-71] [AC5] — Documentación del patrón accordion con scroll horizontal en Storybook
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** la documentación del OrAccordionContainer y del MlAccordion en sus respectivas historias de Storybook
- **WHEN** navegar a la sección Docs de cada componente y revisar las historias y el panel de controls
- **THEN** verificar que existe al menos una historia que muestre el accordion con scroll horizontal activo y que los nuevos props relacionados están descritos con su tipo y valor por defecto
- **Esperado:** Storybook incluye una historia del accordion con scroll horizontal integrado y los nuevos controles están documentados en el panel de controls con tipos y valores por defecto

---

### 6. [SUFI-71] [AC6] — Comportamiento del accordion con scroll horizontal en mobile, tablet y desktop
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el accordion con ml-contextual-item y scroll horizontal habilitado en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev
- **WHEN** inspeccionar el componente en viewport mobile (375 px), luego tablet (768 px) y luego desktop (1280 px) usando las DevTools de Chrome; en cada breakpoint abrir un ítem y hacer scroll horizontal
- **THEN** verificar que el scroll horizontal es funcional en los tres breakpoints y que los ml-contextual-item se dimensionan correctamente sin desbordamiento ni elementos cortados en ninguna resolución
- **Esperado:** el accordion con scroll horizontal funciona correctamente en mobile, tablet y desktop con los ml-contextual-item dimensionados sin overflow en ninguna resolución y con las interacciones de apertura y scroll operativas

---

## Notas

- Sin defectos encontrados durante esta sesión.
- Evidencia visual (Storybook controls, DevTools, preview Vercel) adjunta directamente al ticket de Jira.
- Animaciones de apertura y cierre (AC3) capturadas en video (`SUFI-71 AC3.mp4`) adjunto en la carpeta de evidencias.
- Ausencia de conflictos entre click del accordion y scroll horizontal verificada en AC2 con ambos órdenes de interacción.
- Accesibilidad ARIA y axe DevTools verificados en AC4; navegación por teclado completamente funcional.
- Comportamiento responsive verificado en tres breakpoints (375 px / 768 px / 1280 px) mediante DevTools de Chrome.
