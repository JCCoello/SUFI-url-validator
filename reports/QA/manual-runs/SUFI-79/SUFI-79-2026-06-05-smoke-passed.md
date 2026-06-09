# SUFI-79 — Manual Smoke (run log)

- **Fecha:** 2026-06-05
- **Tester:** JCCoello (juancarlos.coello@applydigital.com)
- **Entorno:**
  - Storybook: https://sufi-acl.vercel.app/
  - Preview: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/
- **Casos de prueba (fuente):** `~/testmo-testcases/Projects/SUFI Test/SUFI-79-TESTMO-MANUAL-SMOKE.csv`
- **Resultado global:** ✅ 4/4 Pass

---

## Resumen por caso

### 1. [SUFI-79] [AC1] — DOM no contiene clases CBC y los prefijos Atomic Design son correctos
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** Storybook del proyecto abierto en https://sufi-acl.vercel.app/ con cualquier historia de átomo, molécula u organismo desplegada y DevTools abierto en la pestaña Console
- **WHEN** ejecutar en la consola: `[...document.querySelectorAll('[class]')].filter(el => [...el.classList].some(c => c.startsWith('cbc-'))).map(el => el.className)`; luego ejecutar: `[...document.querySelectorAll('[class]')].flatMap(el => [...el.classList]).filter(c => /^(at|ml|or)-/.test(c)).slice(0, 10)` para confirmar que los nuevos prefijos están activos
- **THEN** el primer comando retorna `[]` confirmando que ningún elemento tiene clases `cbc-`; el segundo comando retorna clases con prefijos `at-`, `ml-` u `or-` validando que la nomenclatura Atomic Design está aplicada en el DOM
- **Esperado:** el primer comando retorna `[]` y el segundo retorna un arreglo con clases del tipo `at-*/ml-*/or-*` — confirma que la migración está completa y la nueva nomenclatura está activa en el DOM

---

### 2. [SUFI-79] [AC2] — Componentes renderizan sin regresiones visuales en Storybook
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** Storybook del proyecto en https://sufi-acl.vercel.app/ con las categorías Atoms, Molecules y Organisms visibles en el panel de navegación lateral
- **WHEN** navegar por al menos dos historias de la categoría Atoms, dos de Molecules y dos de Organisms revisando un estado representativo de cada componente (default, hover, light mode o dark mode según corresponda)
- **THEN** cada componente se visualiza con tipografía, colores, espaciado y layout correctos sin estilos rotos, bloques sin estilos ni artefactos visuales en ninguno de los tres niveles jerárquicos
- **Esperado:** todos los componentes átomos, moléculas y organismos inspeccionados en Storybook presentan su apariencia visual correcta sin regresiones de estilos atribuibles al cambio de nomenclatura CSS

---

### 3. [SUFI-79] [AC3] — Página Home de la aplicación carga correctamente con la nueva nomenclatura
**Prioridad:** High · **Resultado:** ✅ Pass

- **GIVEN** el entorno de desarrollo de la aplicación SUFI accesible en https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/
- **WHEN** navegar a la página Home, esperar a que cargue completamente y revisar visualmente todas las secciones desplazándose desde el encabezado hasta el pie de página
- **THEN** todos los componentes de la Home (encabezado, hero, secciones de contenido, CTAs, footer) se visualizan con estilos correctos sin bloques sin estilos, sin layout roto y sin diferencias visuales respecto al aspecto esperado
- **Esperado:** la página Home carga y muestra todos sus componentes correctamente estilizados sin regresiones visuales en ninguna sección

---

### 4. [SUFI-79] [AC4] — Documentación en Storybook no hace referencia a la nomenclatura CBC
**Prioridad:** Medium · **Resultado:** ✅ Pass

- **GIVEN** Storybook del proyecto en https://sufi-acl.vercel.app/ con el panel Docs disponible para los componentes
- **WHEN** navegar a la pestaña Docs de al menos tres componentes representativos (un átomo, una molécula y un organismo) y revisar descripciones de props, notas de uso y ejemplos de código incluidos en la documentación
- **THEN** la documentación hace referencia a las nuevas clases con prefijos `at-/ml-/or-` y no contiene instrucciones ni ejemplos que mencionen el prefijo `cbc-` como patrón activo
- **Esperado:** la documentación de Storybook no presenta referencias al prefijo `cbc-` como convención vigente y refleja correctamente la nomenclatura Atomic Design en descripciones y ejemplos

---

## Notas

- Sin defectos encontrados durante esta sesión.
- Evidencia visual (Storybook, DevTools Console, preview Vercel) adjunta directamente al ticket de Jira.
- Migración de nomenclatura CSS verificada en el DOM via consola del navegador (AC1): resultado `[]` para `cbc-` y arreglo con clases `at-/ml-/or-` confirmado.
- Regresiones visuales revisadas en Atoms, Molecules y Organisms en Storybook (AC2): sin artefactos ni estilos rotos en ningún nivel jerárquico.
- Página Home verificada en preview DEV (AC3): todos los componentes (header, hero, contenido, CTAs, footer) correctamente estilizados.
- Documentación Docs de Storybook revisada en tres componentes representativos (AC4): sin referencias al prefijo `cbc-` como convención vigente.
