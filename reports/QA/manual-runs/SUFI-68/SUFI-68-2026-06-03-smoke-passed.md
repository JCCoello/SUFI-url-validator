# SUFI-68 — Manual Smoke (run log)

- **Fecha:** 2026-06-03
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook: https://sufi-acl.vercel.app/?path=/story/organisms-promotional-card--horizontal-background-color
  - Preview: https://sufi-app.vercel.app/test-dev
  - Contentful: https://app.contentful.com/spaces/1bla4bgmu67p/environments/development/entries/2MtpgObygogVo3pVw1jblh
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-68-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 7/7 Pass

---

## Resumen por caso

### 1. [SUFI-68] [AC1] — Nueva prop de color de fondo disponible en los controls del or-promotional-card
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** el or-promotional-card en la historia `horizontal-background-color` de Storybook
- **WHEN** abrir el panel de controls del componente
- **THEN** inspeccionar la presencia de la nueva propiedad de color de fondo y su valor por defecto
- **Esperado:** la nueva propiedad de color de fondo aparece en los controls del componente con un valor por defecto que mantiene la apariencia previa de los usos existentes

---

### 2. [SUFI-68] [AC2] — Validación de color de fondo según la paleta de diseño
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el or-promotional-card en la historia `horizontal-background-color` de Storybook
- **WHEN** asignar a la propiedad de color de fondo primero un valor válido de la paleta y luego un valor fuera de la paleta
- **THEN** inspeccionar el color de fondo aplicado y cualquier mensaje de validación en cada caso
- **Esperado:** los valores de la paleta de diseño se aplican correctamente y los valores fuera de la paleta son rechazados o ignorados sin romper el renderizado del componente

---

### 3. [SUFI-68] [AC3] — Botón primario ajusta su tamaño cuando es el único elemento de la tarjeta
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el or-promotional-card en la historia `horizontal-background-color` configurado sin título, descripción ni otros elementos, dejando solo el botón principal
- **WHEN** comparar el tamaño del botón en esa configuración contra una tarjeta con contenido adicional
- **THEN** inspeccionar las dimensiones del botón principal con DevTools en ambas configuraciones
- **Esperado:** el botón principal aplica el tamaño ajustado definido para cuando es el único elemento y conserva su tamaño estándar cuando la tarjeta contiene otros elementos

---

### 4. [SUFI-68] [AC4] — Contraste de texto sobre el color de fondo personalizado cumple WCAG AA
**Prioridad:** Critical · **Resultado:** ✅ Pass

- **GIVEN** el or-promotional-card en la historia `horizontal-background-color` con cada color de fondo válido de la paleta seleccionado por turno
- **WHEN** medir el contraste entre el color del texto y el color de fondo con una herramienta de accesibilidad
- **THEN** inspeccionar el ratio de contraste reportado para cada color de fondo
- **Esperado:** el ratio de contraste es al menos 4.5:1 para texto normal en todos los colores de fondo válidos, cumpliendo WCAG AA

---

### 5. [SUFI-68] [AC5] — Storybook documenta la nueva prop de color de fondo con ejemplos
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** la documentación del or-promotional-card en la historia `horizontal-background-color` y sus historias relacionadas
- **WHEN** navegar la sección de documentación y los controls del componente
- **THEN** inspeccionar la presencia de la nueva prop de color de fondo y de ejemplos visuales que la ilustren
- **Esperado:** la documentación describe la nueva prop de color de fondo e incluye al menos un ejemplo visual que muestre su efecto

---

### 6. [SUFI-68] [AC6] — Estados visuales del componente se renderizan correctamente con el color de fondo personalizado
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el or-promotional-card renderizado en `https://sufi-app.vercel.app/test-dev` con el color de fondo configurado en la entrada de Contentful
- **WHEN** recorrer los estados visuales del componente (normal, hover y foco del botón principal) en ambas variantes
- **THEN** inspeccionar la apariencia del componente en cada estado
- **Esperado:** cada estado visual se renderiza correctamente con el color de fondo personalizado, sin artefactos visuales ni regresiones respecto al comportamiento previo

---

### 7. [SUFI-68] [AC7] — Ambas variantes (vertical y horizontal) soportan el campo description
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el or-promotional-card en la historia `horizontal-background-color` con un valor en el campo description y la variante alternada entre horizontal y vertical mediante el control de variante
- **WHEN** renderizar la tarjeta en cada disposición (horizontal y vertical)
- **THEN** inspeccionar la presencia y la maquetación del texto de description en ambas variantes
- **Esperado:** ambas variantes muestran el texto de description en la posición esperada sin solaparse con el resto de los elementos de la tarjeta

---

## Notas

- Sin defectos encontrados durante esta sesión.
- Evidencia visual (Storybook controls, DevTools de contraste, preview Vercel, Contentful) adjunta directamente al ticket de Jira.
- Contraste WCAG AA verificado para cada color válido de la paleta de diseño.
