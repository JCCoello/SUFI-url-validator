# SUFI-69 — Manual Smoke (run log)

- **Fecha:** 2026-06-03
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook: https://sufi-acl.vercel.app/?path=/story/molecules-contextual-item--with-pretitle
  - Preview: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/test-dev
  - Contentful: https://app.contentful.com/spaces/1bla4bgmu67p/environments/development/entries/3jo1kgh3JOA8waq3WfibTP
  - Figma: https://www.figma.com/design/pkXFvtuzYHGsMBsHAd9ubO/%F0%9F%94%B4-DS-SuFi-%E2%80%94-v1.0?node-id=5216-24917&t=Zar98QFfIKOdjkwa-4
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-69-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 7/7 Pass

---

## Resumen por caso

### 1. [SUFI-69] [AC1] — Nueva prop pretitle disponible y renderizada antes del título
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el ml-contextual-item en la historia `with-pretitle` de Storybook
- **WHEN** abrir el panel de controls y asignar un valor al campo pretitle
- **THEN** inspeccionar la presencia del campo en los controls y la posición del texto de pretitle respecto al título principal
- **Esperado:** el campo pretitle aparece en los controls y el texto se renderiza por encima o antes del título con la jerarquía tipográfica esperada sin solaparse con el resto del contenido

---

### 2. [SUFI-69] [AC2] — Nueva prop image disponible en los controls del ml-contextual-item
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** el ml-contextual-item en la historia `with-pretitle` de Storybook
- **WHEN** abrir el panel de controls del componente
- **THEN** inspeccionar la presencia del campo image y su valor por defecto
- **Esperado:** el campo image aparece en los controls del componente con un valor por defecto vacío o nulo que mantiene la apariencia previa de los usos existentes

---

### 3. [SUFI-69] [AC3] — Campos pretitle e image son opcionales sin breaking changes
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el ml-contextual-item con los campos pretitle e image vacíos o sin valor
- **WHEN** renderizar el componente sin proporcionar valores para pretitle ni image
- **THEN** inspeccionar el renderizado del componente y la consola del navegador
- **Esperado:** el componente se renderiza idéntico a su estado previo sin pretitle ni image y la consola no muestra errores ni advertencias relacionados con los nuevos campos

---

### 4. [SUFI-69] [AC4] — Renderizado correcto de imagen en diferentes formatos
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el ml-contextual-item con el campo image disponible en los controls
- **WHEN** asignar por turno una URL de imagen en formato PNG, luego JPG, luego SVG y luego WebP
- **THEN** inspeccionar el renderizado de la imagen en cada formato y verificar que no haya errores en la consola ni imágenes rotas
- **Esperado:** la imagen se renderiza correctamente en todos los formatos probados sin distorsión de aspecto ni errores de carga en la consola del navegador

---

### 5. [SUFI-69] [AC5] — Accesibilidad de la imagen: atributo alt presente y descriptivo
**Prioridad:** Critical · **Resultado:** ✅ Pass

- **GIVEN** el ml-contextual-item con una imagen asignada al campo image
- **WHEN** inspeccionar el HTML generado para el elemento de imagen con DevTools
- **THEN** verificar la presencia y el valor del atributo alt en la etiqueta img renderizada
- **Esperado:** el atributo alt está presente en la etiqueta img con un valor descriptivo no vacío; la imagen no renderiza un alt vacío ni ausente que viole WCAG AA

---

### 6. [SUFI-69] [AC6] — Storybook documenta los nuevos campos pretitle e image con ejemplos
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** la historia del ml-contextual-item en Storybook y las demás historias asociadas al componente
- **WHEN** navegar la sección de documentación y los controls del componente
- **THEN** inspeccionar la presencia de los campos pretitle e image y de al menos un ejemplo visual que los ilustre
- **Esperado:** la documentación describe los nuevos campos pretitle e image e incluye al menos un ejemplo visual para cada uno que muestre su efecto en el componente

---

### 7. [SUFI-69] [AC7] — Campos pretitle e image configurados en Contentful se reflejan en el sitio de pruebas
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** la entrada del ml-contextual-item en Contentful con un valor de pretitle y una imagen establecidos
- **WHEN** renderizar el componente en https://sufi-app.vercel.app/test-dev
- **THEN** inspeccionar con DevTools el texto de pretitle y la imagen renderizada en la tarjeta
- **Esperado:** el pretitle y la imagen del ml-contextual-item en el sitio de pruebas coinciden con los valores configurados en el campo de Contentful sin errores de carga ni diferencias visuales

---

## Notas

- Sin defectos encontrados durante esta sesión.
- Evidencia visual (Storybook controls, DevTools, preview Vercel, Contentful) adjunta directamente al ticket de Jira.
- Atributo alt de imagen verificado contra WCAG AA mediante inspección de DevTools.
