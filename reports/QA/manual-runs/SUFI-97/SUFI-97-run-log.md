# SUFI-97 — Smoke: Manual + Playwright (run log)

**Fecha:** 2026-06-15  
**Tester:** JCCoello (juancarlos.coello@applydigital.com)  
**Entorno:** DEV — https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev  
**Storybook:** https://sufi-acl.vercel.app/?path=/story/atoms-button--background-white  

---

## Resultado global

| AC | Descripción | Resultado |
|----|-------------|-----------|
| AC1 | Storybook renderiza bg-white sin errores | ✅ Pass |
| AC2 | Estilos coinciden con Figma | ✅ Pass |
| AC3 | Header en /test-dev refleja variante Contentful | ✅ Pass |
| AC4 | Responsivo 768px y 375px sin overflow | ✅ Pass |

---

## Detalle por AC

---

### AC1 — Storybook renderiza variante background-white sin errores

**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** historia `atoms-button--background-white` en Storybook cargada
- **WHEN** verificar estilos computados del botón y consola
- **THEN** botón visible con fondo blanco, texto legible, sin errores de consola

**Observado:**
- `backgroundColor: rgb(255, 255, 255)` ✅
- `color: rgb(0, 0, 0)` ✅ (texto legible; rojo en elemento hijo — confirmado visualmente en canvas)
- `display: flex`, `visible: true` ✅
- Consola: 0 errores · 1 warning (addon de onboarding de Storybook, no relacionado con el componente)
- Clase aplicada: `at-button__background-white` ✅

---

### AC2 — Estilos coinciden con especificación Figma

**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** diseño Figma de la variante background-white revisado (columna 7 de la matriz de variantes)
- **WHEN** comparar visualmente Storybook vs Figma (fondo, borde, texto, estados)
- **THEN** los estilos coinciden sin diferencias significativas

**Observado:**
- Fondo blanco ✅ · borde rojo brand color ✅ · texto rojo sobre fondo blanco ✅
- Estados (hover, pressed, disabled) visualmente coherentes con la especificación
- Sin diferencias de layout ni color respecto al diseño

---

### AC3 — Botón en header de /test-dev refleja variante background-white de Contentful

**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** entrada Contentful con `variant: background-white` y página `/test-dev` abierta
- **WHEN** localizar el botón "Sufi te presta en línea" en el header desktop
- **THEN** el botón muestra fondo blanco conforme a la variante configurada; sin errores de consola

**Observado:**
- Desktop: clase `at-button__background-white` → `rgb(255, 255, 255)` ✅
- Texto legible sobre fondo blanco ✅
- Consola: 0 errores de componente ✅
- Nota: el menú off-canvas mobile usa una instancia separada con variante hardcoded (`primary`) — fuera del alcance de este ticket, que aplica a la instancia del header desktop.

---

### AC4 — Responsivo en tablet (768px) y móvil (375px)

**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** página `/test-dev` en viewports 768px y 375px
- **WHEN** verificar overflow horizontal y comportamiento del layout
- **THEN** sin desbordamiento horizontal; layout adaptado correctamente al viewport

**Observado — 768px (tablet):**
- Header colapsa a layout hamburger (comportamiento esperado de diseño responsivo)
- Sin overflow horizontal: `bodyWidth === viewportWidth` (768px) ✅
- Consola: 0 errores ✅

**Observado — 375px (móvil):**
- Sin overflow horizontal: `bodyWidth === viewportWidth` (375px) ✅
- Consola: 0 errores ✅

- Nota: la instancia del botón `background-white` (desktop) no se renderiza en estos viewports por diseño del layout responsivo — el menú off-canvas usa una instancia independiente fuera del alcance del ticket.

---

## Verificación automatizada (Playwright)

| Check | Viewport | Resultado |
|-------|----------|-----------|
| `backgroundColor` del at-button en Storybook | Desktop | `rgb(255, 255, 255)` ✅ |
| Consola Storybook | Desktop | 0 errores ✅ |
| Clase CSS aplicada en Storybook | Desktop | `at-button__background-white` ✅ |
| `backgroundColor` desktop header | Desktop | `rgb(255, 255, 255)` ✅ |
| Overflow horizontal | 768px | Sin overflow ✅ |
| Overflow horizontal | 375px | Sin overflow ✅ |
| Errores de consola (DEV) | Todos | 0 errores ✅ |

---

## Evidencia

| Archivo | Descripción |
|---------|-------------|
| `sufi97-AC1-storybook-bg-white-render.png` | AC1 — Storybook con botón background-white |
| `sufi97-AC3-header-cta-desktop.png` | AC3 — CTA desktop con fondo blanco ✅ |
| `sufi97-AC4-tablet-768px-header.png` | AC4 — Header colapsado a hamburger en 768px |
| `sufi97-AC4-tablet-768px-cta-primary-red.png` | AC4 — Menú off-canvas 768px (instancia fuera de scope) |
| `sufi97-AC4-mobile-375px-cta-primary-red.png` | AC4 — Menú off-canvas 375px (instancia fuera de scope) |

---

## Notas

- Sin defectos encontrados en el alcance del ticket.
- La instancia mobile del menú off-canvas usa variante `primary` (rojo) — comportamiento esperado dado que el fondo del menú es blanco y una variante `background-white` resultaría en bajo contraste. Confirmado como fuera del alcance de SUFI-97.
- Sin errores de consola relacionados con el componente en ningún entorno.
