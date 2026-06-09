# SUFI-73 — Manual Smoke (run log)

- **Fecha:** 2026-06-09
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook: https://sufi-acl.vercel.app/?path=/story/organisms-comparative-card--white-primary-variant
  - Preview: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-73-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 5/5 Pass

---

## Resumen por caso

### 1. [SUFI-73] [AC1] — El ml-tag dentro de or-comparative-card muestra el nuevo color celeste
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** Storybook abierto en https://sufi-acl.vercel.app/?path=/story/organisms-comparative-card--white-primary-variant con el or-comparative-card cargado en el canvas y las tags visibles dentro del primer acordeón
- **WHEN** observar visualmente las tags (ml-tag) mostradas dentro del primer acordeón del Comparative Card e inspeccionar su color con DevTools (pestaña Elements → Computed → background-color)
- **THEN** las tags del primer acordeón presentan el color celeste de la paleta Sufi como color principal; el color anterior ya no está aplicado al ml-tag dentro del or-comparative-card; el cambio es visible a simple vista y consistente en todas las tags del acordeón
- **Esperado:** las tags (ml-tag) dentro del primer acordeón del or-comparative-card muestran el color celeste esperado de la paleta Sufi; el color anterior ha sido reemplazado correctamente

---

### 2. [SUFI-73] [AC2] — El color del ml-tag corresponde a los tokens S100 y S400 de la paleta Sufi
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** Storybook en https://sufi-acl.vercel.app/?path=/story/organisms-comparative-card--white-primary-variant con el canvas desplegado y DevTools abierto en la pestaña Elements con el inspector apuntando a un elemento ml-tag dentro del primer acordeón
- **WHEN** seleccionar la tag en DevTools y revisar el atributo style del elemento en la pestaña Elements; identificar los valores de background-color y border aplicados inline al ml-tag
- **THEN** el atributo style del ml-tag contiene background-color: var(--color-sky-100) correspondiente a #C4E8F7 (S100) y border: 1px solid var(--color-sky-400) correspondiente a #81D0F9 (S400); los tokens CSS usados pertenecen a la paleta Sky del DS SuFi; no se usan valores de color hardcoded fuera del sistema de tokens
- **Esperado:** el atributo style del ml-tag contiene var(--color-sky-100) como background-color y var(--color-sky-400) como border-color; ambos tokens corresponden a la paleta Sky de Sufi (S100 = #C4E8F7 y S400 = #81D0F9)

---

### 3. [SUFI-73] [AC3] — El or-comparative-card renderiza el ml-tag actualizado sin regresiones visuales
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** Storybook en https://sufi-acl.vercel.app/?path=/story/organisms-comparative-card--white-primary-variant y la aplicación de prueba en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev ambas accesibles en el navegador
- **WHEN** revisar visualmente el or-comparative-card en Storybook prestando atención al layout, espaciado y estilo de las tags ml-tag dentro del primer acordeón; luego navegar a la aplicación en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev y revisar el mismo componente en contexto real
- **THEN** el ml-tag muestra el color celeste en ambos entornos; el layout del or-comparative-card, el espaciado de las tags y los demás elementos del componente se mantienen sin regresiones; el texto del tag es legible sobre el nuevo fondo celeste; ningún otro elemento del componente presenta estilos rotos o desplazados
- **Esperado:** el or-comparative-card muestra el ml-tag con el color celeste actualizado en Storybook y en la aplicación sin regresiones de layout, espaciado ni estilos en ningún otro elemento del componente

---

### 4. [SUFI-73] [AC4] — El contraste del ml-tag con el nuevo color celeste cumple WCAG AA
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** WebAIM Contrast Checker abierto en https://webaim.org/resources/contrastchecker/ en el navegador
- **WHEN** ingresar #2C2A29 como Foreground Color (color del texto del ml-tag) y #C4E8F7 como Background Color (fondo S100 del ml-tag); revisar el ratio y los indicadores de nivel AA y AAA que muestra la herramienta
- **THEN** la herramienta reporta un ratio de contraste aproximado de 11:1; los indicadores Normal Text y Large Text muestran Pass para WCAG AA (4.5:1) y Pass para WCAG AAA (7:1)
- **Esperado:** WebAIM Contrast Checker reporta un ratio de aproximadamente 11:1 para #2C2A29 sobre #C4E8F7; el ml-tag cumple WCAG AA y AAA para texto normal

---

### 5. [SUFI-73] [AC6] — El ml-tag mantiene visibilidad y contraste en diferentes fondos y contextos
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** Storybook con el or-comparative-card en https://sufi-acl.vercel.app/?path=/story/organisms-comparative-card--white-primary-variant y el Card con fondo celeste en https://sufi-acl.vercel.app/?path=/story/molecules-card--comparative-card-with-price&args=backgroundColor:lighter-sky ambas historias accesibles en el navegador
- **WHEN** revisar el ml-tag en el or-comparative-card sobre su fondo blanco observando la visibilidad y contraste de la tag; luego navegar a la historia del Card con backgroundColor:lighter-sky y revisar el aspecto del tag sobre el fondo celeste para detectar si el color del tag se funde con el fondo
- **THEN** el ml-tag se visualiza correctamente con contraste adecuado sobre el fondo blanco del or-comparative-card; sobre el fondo celeste (lighter-sky) del Card el tag es igualmente legible y se diferencia claramente del fondo; el tag no se funde con ninguno de los fondos evaluados perdiendo legibilidad o visibilidad
- **Esperado:** el ml-tag mantiene visibilidad y contraste apropiados en los contextos de fondo evaluados (fondo blanco del or-comparative-card y fondo celeste lighter-sky del Card); el color del tag es claramente distinguible del fondo en ambos casos

---

## Notas

- Sin defectos encontrados durante esta sesión.
- Evidencia visual (Storybook, DevTools Elements, WebAIM Contrast Checker, preview Vercel) adjunta directamente al ticket de Jira.
- Tokens CSS verificados en DevTools (AC2): var(--color-sky-100) = #C4E8F7 y var(--color-sky-400) = #81D0F9 correctamente aplicados sin valores hardcoded.
- Contraste verificado en WebAIM (AC4): ratio ~11:1 para #2C2A29 sobre #C4E8F7 — cumple WCAG AA y AAA para texto normal.
- Regresiones visuales revisadas en Storybook y preview DEV (AC3): sin layout roto, estilos desplazados ni artefactos visuales.
- Visibilidad en fondos múltiples verificada (AC6): tag distinguible tanto en fondo blanco (or-comparative-card) como en fondo celeste lighter-sky (Card).
