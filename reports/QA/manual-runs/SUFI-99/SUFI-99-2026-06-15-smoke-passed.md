# SUFI-99 — Smoke: Manual + Playwright (run log)

- **Fecha:** 2026-06-15
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook: https://sufi-acl.vercel.app/
  - App DEV: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev
  - Contentful (Development): https://app.contentful.com/spaces/1bla4bgmu67p/environments/development/entries/2MtpgObygogVo3pVw1jblh
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-99-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 4/4 Pass (AC2 eliminado — elemento no construido)

---

## Resumen por caso

### 1. [SUFI-99] [AC1] — Promotional Card horizontal sin Main Button ni Secondary Button renderiza correctamente
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el Promotional Card horizontal sin botones en Storybook en https://sufi-acl.vercel.app/?path=/story/organisms-promotional-card--horizontal-background-color&args=mainButton:!null;backgroundColor:violet-light;secondaryButton:!null con el Canvas completamente cargado; DevTools abierto en la pestaña Console
- **WHEN** verificar visualmente que el área del Card no muestra ningún botón (ni Main Button ni Secondary Button); revisar que el contenido restante del Card (imagen, texto, título) se despliega correctamente sin espacios vacíos anómalos ni desalineamiento provocado por la ausencia de botones; revisar la consola en busca de errores o advertencias
- **THEN** el Promotional Card horizontal renderiza sin ningún botón visible; el layout del Card no presenta huecos ni desalineamientos; la consola no reporta errores ni advertencias relacionadas con los botones opcionales
- **Esperado:** el Promotional Card horizontal renderiza sin botones sin errores visuales ni de consola en Storybook

---

### 2. [SUFI-99] [AC2] — Promotional Card vertical sin botón renderiza correctamente
**Prioridad:** High · **Resultado:** ⚫ N/A — caso eliminado (elemento no construido)

---

### 3. [SUFI-99] [AC3] — El fondo violet-medium se aplica correctamente al Promotional Card
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el Promotional Card horizontal en Storybook en https://sufi-acl.vercel.app/?path=/story/organisms-promotional-card--horizontal-background-color con el panel de Controls visible en la parte inferior del Canvas; DevTools abierto en la pestaña Console
- **WHEN** en el panel de Controls localizar el control backgroundColor y cambiarlo a violet-medium; esperar a que el Canvas se actualice con el nuevo valor; verificar visualmente que el fondo del Card adopta el tono violet-medium; revisar la consola en busca de errores o advertencias relacionadas con el color de fondo
- **THEN** el Promotional Card renderiza con el fondo violet-medium correctamente aplicado; el color de fondo es visualmente distinguible del violet-light; la consola no reporta errores ni advertencias relacionadas con el backgroundColor
- **Esperado:** el Promotional Card acepta y renderiza el fondo violet-medium sin errores visuales ni de consola en Storybook

---

### 4. [SUFI-99] [AC4] — La página de prueba refleja los ajustes de botones opcionales y color de fondo configurados en Contentful
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la entrada de Contentful del Promotional Card en https://app.contentful.com/spaces/1bla4bgmu67p/environments/development/entries/2MtpgObygogVo3pVw1jblh revisada para conocer la configuración actual de Main Button, Secondary Button y Background Color; la página de prueba https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev#promotionalCard abierta en el navegador; DevTools abierto en la pestaña Console
- **WHEN** localizar el Promotional Card en la sección #promotionalCard de la página de prueba; comparar visualmente el Card con la configuración de Contentful verificando que los botones presentes o ausentes coinciden con lo configurado en el CMS y que el color de fondo coincide con el valor configurado; revisar la consola en busca de errores de renderizado o hidratación
- **THEN** el Promotional Card en la página de prueba muestra exactamente los botones configurados en Contentful y el color de fondo coincide con el valor de Background Color configurado en la entrada; la consola no reporta errores relacionados con el renderizado del componente
- **Esperado:** el Promotional Card en la página de prueba coincide con la configuración de Contentful para botones opcionales y color de fondo sin errores de consola

---

### 5. [SUFI-99] [AC5] — Promotional Card es responsivo en viewports de tablet (768px) y móvil (375px)
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de prueba https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev#promotionalCard con el Promotional Card visible; DevTools abierto con Device Toolbar activa
- **WHEN** configurar el viewport a 768px de ancho (tablet) y verificar que el Promotional Card es completamente visible, el texto es legible, no hay desbordamiento horizontal y el layout se adapta correctamente; revisar la consola; a continuación configurar el viewport a 375px de ancho (móvil) y repetir las mismas verificaciones
- **THEN** en viewport tablet (768px) el Promotional Card se muestra completo con texto legible y sin desbordamiento horizontal; en viewport móvil (375px) el Card se adapta al ancho disponible manteniendo legibilidad y sin overflow horizontal; en ambos viewports la consola no reporta errores relacionados con el componente
- **Esperado:** el Promotional Card se visualiza y funciona correctamente en viewports de tablet (768px) y móvil (375px) sin desbordamiento ni pérdida de contenido

---

## Verificación automatizada (Playwright)

| AC | Check | Resultado | Detalle |
|----|-------|-----------|---------|
| AC1 | Sin botones en card DOM | ✅ Pass | `linksInsideCard: []`, `buttonsInsideCard: []` — solo título y descripción |
| AC1 | Consola sin errores | ✅ Pass | 0 errors, 2 warnings (Storybook internos) |
| AC3 | backgroundColor violet-medium aplicado | ✅ Pass | `cardBg: rgb(187, 179, 250)` — tono más saturado que violet-light |
| AC3 | Consola sin errores tras cambio de control | ✅ Pass | 0 errors, 2 warnings (Storybook internos) |
| AC4 | Card en #promotionalCard con violet-light | ✅ Pass | `cardBg: rgb(230, 231, 255)` — coincide con config Contentful |
| AC4 | Sin botones en página de prueba DEV | ✅ Pass | `buttonsInCard: []` — coincide con mainButton/secondaryButton nulos en Contentful |
| AC4 | Consola sin errores | ✅ Pass | 0 errors, 0 warnings |
| AC5 | Sin overflow horizontal en 768px | ✅ Pass | `hasHorizontalOverflow: false`, card 736px dentro de bodyWidth 768px |
| AC5 | Sin overflow horizontal en 375px | ✅ Pass | `hasHorizontalOverflow: false`, card 343px dentro de bodyWidth 375px |
| AC5 | Consola sin errores (sesión completa) | ✅ Pass | 0 errors en DEV post-auth |

---

## Evidencia (screenshots)

| Archivo | AC | Descripción |
|---------|----|-------------|
| `sufi99-AC1-horizontal-sin-botones.png` | AC1 | Storybook — Card horizontal sin botones, mainButton "Set object" en Controls |
| `sufi99-AC3-violet-medium.png` | AC3 | Storybook — Card con fondo violet-medium aplicado vía Controls |
| `sufi99-AC4-contentful-match.png` | AC4 | DEV test page — Card con violet-light, sin botones, contenido real de Contentful |
| `sufi99-AC5-tablet-768px.png` | AC5 | DEV test page — Card en viewport 768px, sin overflow |
| `sufi99-AC5-mobile-375px.png` | AC5 | DEV test page — Card en viewport 375px, sin overflow |

---

## Notas

- AC2 eliminado del alcance — el elemento Promotional Card vertical sin botón no será construido.
- AC1 y AC3 ejecutados en Storybook; AC4 y AC5 en la página de prueba DEV.
- Los 6 errores 401 registrados en consola corresponden a los intentos de carga previos a la autenticación en cada entorno (Vercel auth wall) — no son errores del componente.
- Verificación Playwright confirma ausencia de botones, aplicación correcta de backgroundColor y ausencia de overflow en ambos viewports.
