# SUFI-84 — Manual Smoke (run log)

- **Fecha:** 2026-06-09
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - App QA: https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-84-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 6/6 Pass · ⏸ 2/8 Pendiente (no bloqueantes)

---

## Resumen por caso

### 1. [SUFI-84] [AC1] — La página Home de SUFI se monta y renderiza correctamente en entorno QA
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ accesible en el navegador
- **WHEN** navegar a la URL raíz de QA, esperar que la página Home cargue completamente y observar las secciones principales; abrir DevTools en la pestaña Console para revisar errores relacionados con la carga
- **THEN** la página Home se renderiza con sus secciones principales visibles (Hero, bloque de cards, sección Contáctanos, banner); la consola no muestra errores críticos relacionados con la carga o montaje de la página
- **Esperado:** la página Home de SUFI se muestra correctamente en el entorno QA con sus secciones principales visibles y sin errores de consola

---

### 2. [SUFI-84] [AC2] — La sección Hero de la Home se renderiza con su estructura base en Contentful
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ con la página Home completamente cargada en el navegador
- **WHEN** observar la sección Hero ubicada en la parte superior de la página Home; identificar sus elementos estructurales (contenedor de imagen, título, texto descriptivo, CTA principal)
- **THEN** la sección Hero se renderiza con su estructura base visible; el título y texto descriptivo configurados en Contentful aparecen correctamente; el CTA principal es visible; no hay elementos rotos ni errores visuales en la sección Hero
- **Esperado:** la sección Hero de la Home se renderiza con su estructura base correctamente a partir de la configuración en Contentful, sin errores visuales

---

### 3. [SUFI-84] [AC3] — El bloque de 3 cards se renderiza correctamente con su estructura en Contentful
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ con la página Home completamente cargada en el navegador
- **WHEN** desplazarse hasta la sección del bloque de 3 cards; observar cada card e identificar sus elementos (área de ícono, título, descripción y CTA si aplica)
- **THEN** el bloque muestra exactamente 3 cards; el título y descripción de cada card configurados en Contentful son visibles y correctos; las áreas de ícono se renderizan sin errores visuales aunque los íconos definitivos puedan estar pendientes; no hay cards vacías ni elementos rotos
- **Esperado:** el bloque de 3 cards se renderiza correctamente con la información configurada en Contentful sin errores visuales

---

### 4. [SUFI-84] [AC4] — La sección Contáctanos (contextual item) se renderiza con sus elementos en Contentful
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ con la página Home completamente cargada en el navegador
- **WHEN** desplazarse hasta la sección Contáctanos (contextual item); observar sus elementos (título, texto descriptivo, CTA o información de contacto)
- **THEN** la sección Contáctanos se renderiza con sus elementos configurados en Contentful visibles y correctos; el texto, CTA e información de contacto aparecen sin errores visuales ni contenido faltante
- **Esperado:** la sección Contáctanos se renderiza con todos sus elementos configurados en Contentful sin errores de contenido ni visuales

---

### 5. [SUFI-84] [AC5] — El segundo CTA del banner se muestra correctamente con el componente at-button actual
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ con la página Home completamente cargada en el navegador
- **WHEN** localizar el banner en la página Home y observar sus CTAs; identificar el segundo CTA e inspeccionar su componente en DevTools si es necesario
- **THEN** el segundo CTA del banner se renderiza correctamente usando el componente at-button; el botón es visible, tiene su label configurado en Contentful y no presenta errores visuales ni de consola; la versión actual del at-button es aceptable según revisión del equipo de contenido
- **Esperado:** el segundo CTA del banner se muestra correctamente con el componente at-button actual sin errores visuales

---

### 6. [SUFI-84] [AC6] — La página Home de SUFI es responsiva en viewports tablet y móvil
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ accesible en el navegador con DevTools abierto en la pestaña Device Toolbar (Cmd+Shift+M en Mac / Ctrl+Shift+M en Windows)
- **WHEN** configurar el viewport a 768px de ancho (tablet) y recorrer las secciones principales de la Home (Hero, bloque de cards, Contáctanos, banner); luego configurar el viewport a 375px de ancho (móvil) y recorrer nuevamente las mismas secciones
- **THEN** en viewport tablet (768px) todas las secciones adaptan su layout correctamente sin desbordamientos horizontales ni elementos solapados; en viewport móvil (375px) todas las secciones mantienen su estructura accesible sin desbordamiento horizontal ni contenido truncado
- **Esperado:** la página Home de SUFI se adapta correctamente en viewport tablet (768px) y móvil (375px) sin desbordamientos, elementos rotos ni contenido inaccesible

---

### 7. [SUFI-84] [AC7] — PENDIENTE: El SEO y las URLs de todos los CTAs de la Home están configurados en Contentful
**Prioridad:** Medium · **Resultado:** ⏸ Pendiente

- **Motivo:** El SEO de la página Home y las URLs de todos los CTAs aún no están configurados en Contentful (listados como pendientes por el equipo de contenido en el ticket). Este caso no es bloqueante para el cierre del ticket — se ejecutará una vez que ambos puntos estén configurados en Contentful y desplegados en QA.
- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ con la página Home completamente cargada en el navegador
- **WHEN** abrir DevTools e inspeccionar el `<head>` para verificar los meta tags de SEO (title, description, og:title, og:description, og:image, canonical); luego hacer clic en cada CTA de la Home (Hero, bloque de cards, Contáctanos, banner) y observar la URL de destino y el comportamiento de navegación
- **THEN** el tag `<title>` y los meta tags de description y Open Graph contienen los valores configurados en Contentful; la URL canónica es correcta; cada CTA redirige a su URL de destino definida en Contentful sin presentar URL vacía, enlace roto ni redirección a página de error
- **Esperado:** el SEO de la Home está correctamente configurado en Contentful y todos los CTAs redirigen a sus URLs de destino sin errores

---

### 8. [SUFI-84] [AC8] — PENDIENTE: Imágenes del Hero, íconos del bloque de 3 cards y color del contextual item de Contáctanos coinciden con el diseño
**Prioridad:** Medium · **Resultado:** ⏸ Pendiente

- **Motivo:** Las imágenes del Hero y los íconos del bloque de 3 cards aún no están configurados en Contentful; el color del contextual item de la sección Contáctanos es más oscuro que la propuesta de diseño y requiere apoyo del equipo de diseño. Este caso no es bloqueante para el cierre del ticket — se ejecutará una vez que los tres puntos estén resueltos y desplegados en QA.
- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ con la página Home completamente cargada en el navegador y la propuesta de diseño disponible para comparación
- **WHEN** observar la sección Hero y verificar que sus imágenes se cargan correctamente desde Contentful (sin placeholders ni errores 404 en la pestaña Network); desplazarse al bloque de 3 cards y verificar que cada card muestra su ícono correspondiente sin errores visuales; desplazarse a la sección Contáctanos y comparar el color del contextual item con el valor definido en la propuesta de diseño
- **THEN** las imágenes del Hero se muestran correctamente según los assets configurados en Contentful; cada una de las 3 cards muestra su ícono correspondiente sin placeholders ni errores; el color del contextual item de la sección Contáctanos coincide con el valor de la propuesta de diseño aprobada y no presenta un tono más oscuro que el esperado
- **Esperado:** las imágenes del Hero y los íconos del bloque de 3 cards se muestran correctamente desde Contentful; el color del contextual item de Contáctanos coincide con la propuesta de diseño

---

## Notas

- AC1–AC6 ejecutados y aprobados sin incidencias en el entorno QA.
- AC7–AC8 marcados como **Pendiente** por configuraciones de contenido y diseño aún no resueltas en el momento de la ejecución; ninguno de estos casos es bloqueante para el cierre del ticket.
  - AC7: SEO de la Home y URLs de todos los CTAs pendientes de configuración en Contentful por el equipo de contenido.
  - AC8: imágenes del Hero e íconos del bloque de 3 cards pendientes de configuración en Contentful; color del contextual item de Contáctanos más oscuro que el diseño, requiere apoyo del equipo de diseño.
- Evidencia visual (Home QA, secciones Hero/cards/Contáctanos/banner, viewports 768px y 375px) adjunta directamente al ticket de Jira.
