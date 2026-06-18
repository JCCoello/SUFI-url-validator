# SUFI-96 — Smoke: Manual + Playwright (run log)

- **Fecha:** 2026-06-15
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - App DEV: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev
  - Contentful (OrContainer Flip Card): https://app.contentful.com/spaces/1bla4bgmu67p/environments/development/entries/3STjnDLuYFpmIxUvaJXQtS
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-96-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 5/5 Pass · sin defectos encontrados
- **Verificación automatizada:** Playwright MCP — hash scroll, viewport ancla, consola sin errores

---

## Resumen por caso

### 1. [SUFI-96] [AC1] — El enlace ancla #flip-card hace scroll automático a la sección Flip Card al cargar la página
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de prueba con el OrContainer Flip Card configurado con Target Section Id `flip-card` en Contentful; DevTools abierto en Console
- **WHEN** navegar directamente a https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev#flip-card y esperar a que la página cargue completamente
- **THEN** la página hace scroll automático hasta la sección Flip Card al cargar sin interacción del usuario; la sección es visible en el viewport; la URL mantiene el fragmento #flip-card; la consola no reporta errores
- **Esperado:** scroll automático a la sección Flip Card al cargar con #flip-card en la URL, sin errores de consola
- **Observado:** scroll automático ejecutado correctamente al cargar; sección Flip Card visible en el viewport; URL conserva el fragmento #flip-card; consola sin errores

---

### 2. [SUFI-96] [AC2] — El enlace ancla #orSlider hace scroll automático a la sección orSlider al cargar la página
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de prueba con el OrContainer orSlider configurado con Target Section Id `orSlider` en Contentful; DevTools abierto en Console
- **WHEN** navegar directamente a https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev#orSlider y esperar a que la página cargue completamente
- **THEN** la página hace scroll automático hasta la sección orSlider al cargar sin interacción del usuario; la sección es visible en el viewport; la URL mantiene el fragmento #orSlider; la consola no reporta errores
- **Esperado:** scroll automático a la sección orSlider al cargar con #orSlider en la URL, sin errores de consola
- **Observado:** scroll automático ejecutado correctamente al cargar; sección orSlider visible en el viewport; URL conserva el fragmento #orSlider; consola sin errores

---

### 3. [SUFI-96] [AC3] — Una URL sin hash carga la página desde el inicio sin scroll automático
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la página de prueba sin fragmento hash en la URL; DevTools abierto en Console
- **WHEN** navegar a https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev sin hash y esperar a que la página cargue completamente
- **THEN** la página se carga mostrando el inicio del viewport sin scroll automático; el contenido visible corresponde a la parte superior de la página; la consola no reporta errores relacionados con el enlace ancla
- **Esperado:** carga desde el inicio sin scroll automático y sin errores de consola
- **Observado:** página cargada desde el tope sin ningún desplazamiento automático; consola sin errores

---

### 4. [SUFI-96] [AC4] — Un hash que no corresponde a ningún Target Section Id no rompe la página
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** la página de prueba con DevTools en Console; ningún OrContainer tiene Target Section Id coincidente con el hash a probar
- **WHEN** navegar a https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev#seccion-inexistente y esperar a que la página cargue completamente
- **THEN** la página carga correctamente sin pantalla de error ni interrupción; no se produce scroll automático; la consola no reporta errores fatales; el contenido general de la página es visible y funcional
- **Esperado:** carga correcta sin scroll automático ni errores fatales con hash inválido
- **Observado:** página cargada correctamente desde el tope sin scroll automático; sin errores fatales en consola; contenido visible y funcional

---

### 5. [SUFI-96] [AC5] — La funcionalidad de enlace ancla funciona correctamente en viewports de tablet y móvil
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la URL https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev#flip-card; DevTools con Device Toolbar activa
- **WHEN** configurar el viewport a 768px (tablet) y navegar a la URL con hash; esperar carga completa; repetir con viewport de 375px (móvil)
- **THEN** en 768px la página hace scroll automático hasta la sección Flip Card al cargar sin scroll manual adicional; en 375px la funcionalidad es idéntica; consola sin errores en ambos viewports
- **Esperado:** scroll automático al cargar con #flip-card en tablet (768px) y móvil (375px) sin errores
- **Observado:** scroll automático ejecutado correctamente al cargar en 768px y 375px; sección Flip Card visible en el viewport en ambos casos; consola sin errores

---

## Verificación automatizada (Playwright MCP)

| AC | Check | Resultado | Detalle |
|----|-------|-----------|---------|
| AC1 | Hash scroll #flip-card (desktop) | ✅ | scrollY=1248 · hash="#flip-card" · sectionTop=152px · inViewport=true |
| AC2 | Hash scroll #orSlider (desktop) | ✅ | scrollY=1990 · hash="#orSlider" · sectionTop=152px · inViewport=true |
| AC3 | Sin hash → scroll en cero | ✅ | scrollY=0 · hash="" · sin scroll automático |
| AC4 | Hash inválido → sin error | ✅ | scrollY=0 · hash="#seccion-inexistente" · página cargada · sin error page |
| AC5 | Hash scroll 768px tablet | ✅ | scrollY=1206 · sectionTop=286px · inViewport=true |
| AC5 | Hash scroll 375px móvil | ✅ | scrollY=1674 · sectionTop=256px · inViewport=true |
| — | Consola (total sesión) | ✅ | 0 errores · 0 warnings de aplicación |

### Screenshots capturados

| Archivo | AC cubierto |
|---------|-------------|
| `sufi96-AC1-flip-card-autoscroll.png` | AC1 — hash #flip-card, sección en viewport (desktop) |
| `sufi96-AC2-orSlider-autoscroll.png` | AC2 — hash #orSlider, sección en viewport (desktop) |
| `sufi96-AC3-no-hash-top.png` | AC3 — sin hash, página cargada desde el tope |
| `sufi96-AC4-invalid-hash.png` | AC4 — hash inválido, sin error page ni crash |
| `sufi96-AC5-tablet-768px.png` | AC5 — hash #flip-card en viewport 768px tablet |
| `sufi96-AC5-mobile-375px.png` | AC5 — hash #flip-card en viewport 375px móvil |

## Notas

- AC1–AC5 ejecutados y aprobados sin incidencias en verificación manual y automatizada.
- Evidencia visual adjunta directamente al ticket de Jira (ver tabla de screenshots — cada imagen incluye badge de AC en esquina superior derecha).
