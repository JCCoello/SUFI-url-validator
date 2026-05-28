# SUFI-36 — Manual Smoke (run log)

- **Fecha:** 2026-05-22
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:** https://sufi-acl.vercel.app/?path=/story/atoms-button--secondary-red
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-36-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 8/8 Pass

---

## Resumen por caso

### 1. Variante secondary-red disponible en Storybook
**Prioridad:** Critical · **Resultado:** ✅ Pass

- **GIVEN** la historia secondary-red publicada en el Storybook
- **WHEN** se carga la historia en el navegador
- **THEN** inspeccionar el render del componente at-button y la consola
- **Esperado:** la variante secondary-red se muestra como un at-button renderizado sin errores en consola

### 2. Color secondary-red coincide con la especificación de Figma
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia secondary-red en Storybook
- **WHEN** inspeccionar el color de fondo del botón con DevTools
- **THEN** comparar el valor de color con el token rojo secundario definido por diseño
- **Esperado:** el color de fondo del botón coincide con el token rojo secundario de la guía de diseño

### 3. Contraste de texto sobre secondary-red cumple WCAG AA
**Prioridad:** Critical · **Resultado:** ✅ Pass

- **GIVEN** la historia secondary-red en Storybook
- **WHEN** medir el contraste del texto sobre el fondo del botón con una herramienta de accesibilidad
- **THEN** inspeccionar el ratio de contraste reportado
- **Esperado:** el ratio de contraste es al menos 4.5:1 para texto normal cumpliendo WCAG AA
- **Herramienta utilizada:** WAVE Evaluation Tool (verdict global: "No contrast errors detected")

### 4. Estado normal renderiza según diseño
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia secondary-red en Storybook
- **WHEN** el botón se muestra sin interacción del usuario
- **THEN** inspeccionar fondo, texto y borde del estado normal
- **Esperado:** el estado normal coincide con la especificación de diseño en fondo, texto y borde

### 5. Estado hover responde con el color esperado
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia secondary-red en Storybook
- **WHEN** posicionar el cursor sobre el botón
- **THEN** inspeccionar el cambio visual del estado hover
- **Esperado:** el botón cambia al color hover definido y el cursor muestra puntero

### 6. Estado active responde al click
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia secondary-red en Storybook
- **WHEN** hacer click sostenido sobre el botón
- **THEN** inspeccionar el cambio visual del estado active
- **Esperado:** el botón cambia al color active definido mientras se mantiene presionado

### 7. Estado disabled visualmente y no interactivo
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la historia secondary-red con el control disabled activado
- **WHEN** intentar interactuar con el botón mediante hover y click
- **THEN** inspeccionar la apariencia y la respuesta a la interacción
- **Esperado:** el botón muestra estilo deshabilitado, no responde a hover ni click y el cursor indica not-allowed

### 8. Variante exportada desde el paquete at-button
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** el paquete at-button del repositorio sufi-acl
- **WHEN** importar la variante secondary-red desde el archivo de exports del componente
- **THEN** inspeccionar la disponibilidad de la variante para proyectos consumidores
- **Esperado:** la variante secondary-red está exportada e importable sin errores de TypeScript ni de build

---

## Notas

- Sin defectos encontrados durante esta sesión.
- Evidencia visual adjunta directamente al ticket de Jira correspondiente.
