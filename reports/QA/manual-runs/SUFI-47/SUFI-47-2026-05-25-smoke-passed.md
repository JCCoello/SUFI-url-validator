# SUFI-47 — Manual Smoke (run log)

- **Fecha:** 2026-05-25
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook: https://sufi-acl.vercel.app/?path=/story/organisms-menu-header--default
  - Preview: https://sufi-app.vercel.app/
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-47-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 9/9 Pass

---

## Resumen por caso

### 1. Propiedad opensDropdownDirectly disponible en SmMenuItem
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** el paquete or-header del repositorio sufi-acl con SmMenuItem tipado
- **WHEN** inspeccionar la definición de tipo de SmMenuItem y su uso en la historia default
- **THEN** inspeccionar la propiedad opensDropdownDirectly y su valor por defecto
- **Esperado:** la propiedad opensDropdownDirectly existe como boolean con valor por defecto false y no genera errores de TypeScript ni de build

---

### 2. Item con opensDropdownDirectly muestra ícono de flecha a la derecha
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia default del or-header en Storybook
- **WHEN** se renderiza el navbar negro con un item configurado con opensDropdownDirectly: true (por ejemplo Negocios especializados)
- **THEN** inspeccionar el item y el ícono adyacente a su etiqueta
- **Esperado:** el item muestra un ícono de flecha (toggle) a la derecha del texto dentro del navbar negro

---

### 3. Click en item directo abre dropdown anclado al navbar negro
**Prioridad:** Critical · **Resultado:** ✅ Pass

- **GIVEN** la historia default del or-header en Storybook
- **WHEN** hacer click sobre el item Negocios especializados en el navbar negro
- **THEN** inspeccionar la posición y el ancla del dropdown abierto y el estado de la barra roja
- **Esperado:** el dropdown se abre anclado al navbar negro sin abrir la barra roja ni interferir con el flujo del submenú actual

---

### 4. Dropdown directo reutiliza el HTML y CSS del panel blanco
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia default del or-header en Storybook
- **WHEN** abrir el dropdown directo de un item con opensDropdownDirectly: true
- **THEN** comparar la estructura y los estilos del dropdown contra el panel blanco existente
- **Esperado:** el dropdown directo reutiliza el mismo HTML y CSS del panel blanco actual sin estilos duplicados

---

### 5. Grilla interna organiza enlaces en columnas de 8 filas
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia default del or-header en Storybook con una categoría que contenga 9 o más enlaces
- **WHEN** abrir el dropdown directo
- **THEN** inspeccionar la disposición de los enlaces dentro de la categoría
- **Esperado:** los enlaces se organizan en columnas de 8 filas y el noveno enlace inicia una nueva columna a la derecha

---

### 6. Categorías del dropdown se distribuyen de a 2 por fila
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia default del or-header en Storybook con 3 o más categorías en el dropdown directo
- **WHEN** abrir el dropdown directo
- **THEN** inspeccionar la distribución de las categorías
- **Esperado:** las primeras 2 categorías ocupan 50% de ancho cada una y la tercera salta a la siguiente fila

---

### 7. Mock por defecto del header refleja la nueva estructura
**Prioridad:** Critical · **Resultado:** ✅ Pass

- **GIVEN** la historia default del or-header en la preview `https://sufi-app.vercel.app/`
- **WHEN** renderizar el header con el mock por defecto e interactuar con cada item del navbar
- **THEN** inspeccionar la jerarquía y el comportamiento de cada item
- **Esperado:** Inicio abre el panel rojo y blanco con sus items, Personas / Negocios / Tu360 funcionan como redirects, Negocios especializados abre el dropdown directo y Consumidor Financiero se muestra como link secundario
- **Nota:** este caso fue ejecutado sobre el preview (sufi-app), no sobre Storybook, según la última actualización de la fuente en Testmo.

---

### 8. homeLinkLabel por defecto removido
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** la historia default del or-header en Storybook sin homeLinkLabel pasado por props
- **WHEN** renderizar el header
- **THEN** inspeccionar el enlace de inicio en el header rojo
- **Esperado:** no se muestra una etiqueta por defecto para homeLinkLabel (Inicio) cuando la prop no se provee

---

### 9. Flujo de submenú rojo y panel blanco no se ve afectado
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia default del or-header en Storybook
- **WHEN** hacer click sobre un item del navbar negro sin opensDropdownDirectly (por ejemplo Inicio)
- **THEN** inspeccionar la apertura del flujo existente
- **Esperado:** el flujo de barra roja y panel blanco se abre y se comporta igual que antes sin interferir con el dropdown directo

---

## Notas

- Sin defectos encontrados durante esta sesión.
- El caso 7 valida la integración del header en el preview (`sufi-app.vercel.app`) además de Storybook, confirmando la observación inicial sobre paridad de superficies.
- Evidencia visual adjunta directamente al ticket de Jira correspondiente.
