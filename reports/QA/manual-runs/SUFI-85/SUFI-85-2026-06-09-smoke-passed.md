# SUFI-85 — Manual Smoke (run log)

- **Fecha:** 2026-06-09
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - App QA: https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-85-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 4/4 Pass · ⏸ 4/8 Pendiente (no bloqueantes)

---

## Resumen por caso

### 1. [SUFI-85] [AC1] — El navbar de SUFI se monta y renderiza correctamente en el entorno QA
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ accesible en el navegador
- **WHEN** navegar a la URL de QA, esperar que la página cargue completamente y observar el navbar en la parte superior de la página; abrir DevTools en la pestaña Console para revisar errores relacionados con la carga del navbar
- **THEN** el navbar se renderiza en la parte superior de la página con logo, enlaces de navegación principal y CTA visibles; la consola no muestra errores críticos relacionados con la carga o montaje del navbar
- **Esperado:** el navbar de SUFI se muestra correctamente en la parte superior de la página QA con sus elementos principales visibles y sin errores de consola

---

### 2. [SUFI-85] [AC2] — El ítem de navegación del Blog muestra el label "Blog" y no "Ayuda"
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ con el navbar completamente cargado en el navegador
- **WHEN** observar visualmente los ítems de navegación principales del navbar e identificar el ítem asociado a la sección Blog
- **THEN** el ítem de navegación muestra el texto "Blog" de forma correcta; el label "Ayuda" no aparece en el menú de navegación principal del navbar
- **Esperado:** el ítem de navegación correspondiente a la sección Blog muestra el label "Blog" y el label anterior "Ayuda" no está presente en el navbar

---

### 3. [SUFI-85] [AC3] — El submenú de Clientes despliega sus ítems actuales sin errores visuales
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ con el navbar cargado y el navegador en viewport de escritorio
- **WHEN** hacer hover o clic sobre el ítem "Clientes" en el navbar para desplegar su submenú (sm-menu-item); observar los ítems desplegados
- **THEN** el submenú de Clientes se despliega sin errores visuales; los ítems de navegación configurados en Contentful son visibles; no hay ítems con texto vacío, duplicados ni faltantes en el submenú
- **Esperado:** el submenú de Clientes se despliega correctamente mostrando todos sus ítems actuales configurados en Contentful sin errores visuales ni de contenido

---

### 4. [SUFI-85] [AC4] — El navbar de SUFI es responsivo en viewports tablet y móvil
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ accesible en el navegador con DevTools abierto en la pestaña Device Toolbar (Cmd+Shift+M en Mac / Ctrl+Shift+M en Windows)
- **WHEN** configurar el viewport a 768px de ancho (tablet) y observar el navbar; luego configurar el viewport a 375px de ancho (móvil) y observar nuevamente el navbar
- **THEN** en viewport tablet (768px) el navbar adapta su layout correctamente y los elementos de navegación son accesibles sin desbordamientos horizontales; en viewport móvil (375px) el navbar muestra un control de menú (ej. ícono hamburguesa) para acceder a la navegación sin desbordamiento horizontal ni elementos truncados o solapados
- **Esperado:** el navbar de SUFI se adapta correctamente en viewport tablet (768px) y móvil (375px) sin desbordamientos, elementos rotos ni contenido inaccesible

---

### 5. [SUFI-85] [AC5] — PENDIENTE: El submenú de Clientes incluye el 5to elemento definido por el equipo de contenido
**Prioridad:** Medium · **Resultado:** ⏸ Pendiente

- **Motivo:** El equipo de contenido aún no ha definido si se agrega un 5to elemento al sm-menu-item de Clientes. Este caso no es bloqueante para el cierre del ticket — se ejecutará una vez que la decisión esté tomada y el elemento esté configurado en Contentful y desplegado en QA.
- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ con el navbar cargado y el navegador en viewport de escritorio
- **WHEN** hacer hover o clic sobre el ítem "Clientes" en el navbar para desplegar su submenú (sm-menu-item); contar y observar todos los ítems desplegados
- **THEN** el submenú de Clientes muestra 5 ítems de navegación; el 5to elemento es visible con su label y URL correctos según lo definido por el equipo de contenido en Contentful; no hay errores visuales ni duplicados
- **Esperado:** el submenú de Clientes muestra correctamente 5 ítems de navegación incluyendo el nuevo 5to elemento configurado en Contentful

---

### 6. [SUFI-85] [AC6] — PENDIENTE: La barra de búsqueda está habilitada y funcional en el navbar
**Prioridad:** Medium · **Resultado:** ⏸ Pendiente

- **Motivo:** La barra de búsqueda aún no ha sido habilitada en la estructura del navbar (pendiente de decisión del equipo de contenido en el ticket). Este caso no es bloqueante para el cierre del ticket — se ejecutará una vez que la barra de búsqueda esté habilitada en Contentful y desplegada en QA.
- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ con el navbar completamente cargado en el navegador
- **WHEN** localizar el ícono o campo de búsqueda en el navbar y hacer clic para activarlo; ingresar un término de búsqueda de prueba
- **THEN** la barra de búsqueda se activa y acepta texto; el campo es visible, interactivo y funcional; no hay errores visuales ni de consola al abrir o usar la barra de búsqueda
- **Esperado:** la barra de búsqueda se despliega correctamente desde el navbar, acepta texto y responde sin errores

---

### 7. [SUFI-85] [AC7] — PENDIENTE: El botón "Sufi te presta en línea" presenta el estilo de botón correcto
**Prioridad:** Medium · **Resultado:** ⏸ Pendiente

- **Motivo:** El estilo de botón para el CTA "Sufi te presta en línea" aún no está definido ni aplicado en el navbar. Este caso no es bloqueante para el cierre del ticket — se ejecutará una vez que el estilo sea definido e implementado en Contentful y desplegado en QA.
- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ con el navbar completamente cargado en el navegador
- **WHEN** localizar el elemento "Sufi te presta en línea" en el navbar y observar su apariencia visual comparada con el diseño definitivo
- **THEN** el elemento "Sufi te presta en línea" presenta el estilo de botón definido en el diseño (color de fondo, tipografía, borde y hover correctos); el estilo es consistente con el sistema de diseño de SUFI
- **Esperado:** el CTA "Sufi te presta en línea" muestra el estilo de botón correcto y consistente con el sistema de diseño de SUFI

---

### 8. [SUFI-85] [AC8] — PENDIENTE: Los URLs de "Tus beneficios", "Paga tu cuota", "Aprende con Sufi" y "Corporativos" están definidos en el navbar
**Prioridad:** Medium · **Resultado:** ⏸ Pendiente

- **Motivo:** Los ítems Tus beneficios, Paga tu cuota, Aprende con Sufi y Corporativos (Header) aún no tienen URL definida en Contentful. Este caso no es bloqueante para el cierre del ticket — se ejecutará una vez que los URLs sean definidos y configurados en Contentful.
- **GIVEN** el entorno QA de la aplicación SUFI en https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ con el navbar completamente cargado en el navegador
- **WHEN** hacer clic sobre cada uno de los siguientes ítems del navbar: Tus beneficios, Paga tu cuota, Aprende con Sufi y Corporativos (en el Header); observar la URL de destino y el comportamiento de navegación
- **THEN** cada ítem redirige a la URL destino correcta definida en Contentful; ningún ítem presenta URL vacía, enlace roto ni redirección a una página de error
- **Esperado:** los ítems Tus beneficios, Paga tu cuota, Aprende con Sufi y Corporativos del navbar redirigen correctamente a sus URLs de destino definidas en Contentful

---

## Notas

- AC1–AC4 ejecutados y aprobados sin incidencias en el entorno QA.
- AC5–AC8 marcados como **Pendiente** por decisiones de contenido aún no resueltas en el momento de la ejecución; ninguno de estos casos es bloqueante para el cierre del ticket.
  - AC5: decisión pendiente sobre si se agrega un 5to elemento al submenú de Clientes.
  - AC6: barra de búsqueda comentada/deshabilitada en Contentful por el equipo de contenido.
  - AC7: estilo definitivo del CTA "Sufi te presta en línea" aún no definido.
  - AC8: URLs de Tus beneficios, Paga tu cuota, Aprende con Sufi y Corporativos no configurados aún en Contentful.
- Evidencia visual (navbar QA, submenú Clientes, viewports 768px y 375px) adjunta directamente al ticket de Jira.
