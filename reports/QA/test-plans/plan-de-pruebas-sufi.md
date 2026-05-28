# Plan de Pruebas — Migración SUFI / Banitsimo

> Borrador maestro pensado para alimentar NotebookLM.
> Describe la estrategia de pruebas QA del proyecto en su estado actual (pruebas manuales visuales sobre Storybook) y su evolución prevista (automatización con Playwright a medida que el proyecto madura).

---

## 1. Propósito

Definir el enfoque de calidad para la migración de SUFI a Banitsimo, garantizando que cada componente del sistema de diseño, cada página y cada flujo de contenido entregado se comporta de acuerdo con los criterios de aceptación pactados con diseño, producto y desarrollo.

El plan persigue tres objetivos principales:

1. **Asegurar la paridad visual y funcional** entre Storybook (entorno de referencia del sistema de diseño) y la página de previsualización (entorno integrado con Contentful).
2. **Cubrir los aspectos de accesibilidad y experiencia** (contraste, estados interactivos, foco, animaciones) antes de cada release.
3. **Establecer una base reproducible y trazable** para que las pruebas manuales actuales evolucionen hacia un suite automatizado en Playwright sin perder cobertura.

---

## 2. Alcance

### Dentro del alcance

- Componentes del sistema de diseño SUFI / Banitsimo publicados en Storybook (`sufi-acl.vercel.app`).
- Renderizado de esos componentes dentro del entorno de previsualización (`sufi-app.vercel.app`) cuando se controlan desde Contentful.
- Migración de URLs y redirecciones (validación HTTP) mediante el CLI / spec de Playwright incluido en este mismo repositorio.
- Verificación de accesibilidad básica (contraste WCAG AA, foco visible, jerarquía semántica) sobre los componentes en alcance.
- Verificación de integración con Contentful: campos que controlan la variante / estado del componente.
- Cobertura multi-navegador y multi-dispositivo según la matriz definida en §4.
- **Pruebas E2E de flujos de negocio** (alcance preliminar, en construcción): se incorporan al plan a medida que los flujos se estabilizan y producto / desarrollo confirmen el detalle de cada uno. Hoy se mantienen como cobertura exploratoria; pasan a casos formales cuando el flujo esté definido punta a punta.

### Fuera del alcance (por ahora)

- Pruebas de carga y rendimiento del backend.
- Pruebas de seguridad de la plataforma (cubiertas por el equipo correspondiente).
- Pruebas en dispositivos físicos no contemplados en la matriz oficial (§4).

---

## 3. Contexto del producto

- **Producto:** SUFI (rebrand y migración a Banitsimo).
- **Arquitectura QA-relevante:**
  - **Storybook** como fuente de referencia del sistema de diseño y los componentes (átomos, moléculas, organismos).
  - **Sitio de previsualización** (`/test-dev` y rutas equivalentes) que consume los mismos componentes integrados con datos reales desde Contentful.
  - **Contentful** como CMS que controla variantes, contenido y configuración de los componentes.
  - **Figma — DS SuFi v1.0** como fuente de verdad del diseño visual y los tokens.
  - **Testmo** como repositorio de casos de prueba manuales.
  - **Jira (proyecto SUFI)** como sistema de tickets y trazabilidad.

---

## 4. Entornos

### 4.1. Entornos lógicos

| Entorno | URL / Ubicación | Propósito |
|---|---|---|
| Storybook | `https://sufi-acl.vercel.app` | Referencia aislada de cada componente del sistema de diseño |
| Preview (test-dev) | `https://sufi-app.vercel.app/test-dev` | Componentes integrados con Contentful, listos para verificación end-to-end visual |
| Contentful | Espacio de SUFI | Control de variantes, copys y configuración por entrada |
| Figma | DS SuFi v1.0 | Especificación visual y de tokens |
| Testmo | Proyecto "SUFI Test" | Definición y mantenimiento de casos de prueba manuales |
| Jira | Proyecto SUFI | Tickets, criterios de aceptación y evidencia |

### 4.2. Matriz de navegadores y dispositivos

La cobertura objetivo combina tres navegadores y tres familias de viewport. Cada caso Critical / High debe ejecutarse al menos una vez por cada combinación marcada como obligatoria; el resto se cubre por muestreo según la naturaleza del componente.

| Navegador | Desktop | Tablet | Mobile |
|---|---|---|---|
| Chrome (Chromium / Brave) | ✅ Obligatorio | ✅ Obligatorio | ✅ Obligatorio |
| Safari | ✅ Obligatorio | ✅ Obligatorio | ✅ Obligatorio |
| Edge | ✅ Obligatorio | — | — |

**Viewports de referencia:**

- **Desktop:** 1440 × 900 (referencia principal de diseño); secundario 1280 × 800.
- **Tablet:** 1024 × 768 (horizontal) y 768 × 1024 (vertical).
- **Mobile:** 390 × 844 (iPhone 14 / 15 base) y 360 × 800 (Android base).

**Criterios prácticos:**

- En manual, los breakpoints se simulan con el responsive mode de DevTools salvo que el caso requiera dispositivo físico.
- Cuando un defecto sea específico de un navegador o viewport, documentarlo explícitamente en el run log y en el ticket.
- En la fase de automatización (§5.2), la matriz se traduce a proyectos de Playwright (`chromium`, `webkit`, `msedge`) y a `device` presets para tablet / mobile.

---

## 5. Estrategia de pruebas

La estrategia se ejecuta en dos fases superpuestas: una fase manual visual madura y activa, y una fase de automatización que se incorpora progresivamente.

### 5.1. Estado actual — Pruebas manuales visuales sobre Storybook

Hoy, el grueso de la verificación se realiza de forma manual contra Storybook y, en paralelo, contra la página de previsualización. El objetivo es validar que cada componente publicado cumple su especificación visual, funcional y de accesibilidad antes de considerarlo listo para integración o release.

**Qué se prueba en cada componente:**

1. **Identidad y estructura del componente**
   - Existencia de los elementos esperados (botones, íconos, secciones).
   - Jerarquía visual y estructura DOM consistente con el diseño.

2. **Estilo visual y tokens del sistema de diseño**
   - Color de fondo, texto y borde según los tokens del DS v1.0.
   - Tipografía (familia, peso, tamaño, line-height).
   - Espaciados, radios y sombras de acuerdo con Figma.

3. **Estados interactivos**
   - Normal, hover, active, focus visible y disabled.
   - Cursor correcto (`pointer` donde corresponde).
   - Cambios de estilo coherentes con la variante asignada.

4. **Variantes controladas por Contentful**
   - Cada campo relevante en Contentful (por ejemplo `Front Button Color`, `Back Button Color`) se prueba al menos una vez por valor disponible.
   - Se verifica que cambiar el campo en Contentful aplica la variante sin requerir despliegue de código.

5. **Animaciones y transiciones**
   - Las animaciones se ejecutan de forma fluida.
   - Los elementos interactivos permanecen visibles y funcionales durante la transición y responden correctamente al finalizar.

6. **Accesibilidad**
   - Contraste de texto sobre fondo ≥ 4.5:1 (WCAG AA) para texto normal en estados normal, hover y active.
   - Foco visible al navegar con teclado.
   - Etiquetas accesibles y roles semánticos correctos (verificado con axe DevTools / WAVE).

7. **Paridad Storybook ↔ Preview**
   - Cada caso relevante se verifica en ambos entornos cuando aplica.
   - Cualquier divergencia se documenta como defecto.

**Cómo se ejecuta:**

- Cada ticket (SUFI-XX) tiene su carpeta `reports/QA/manual-runs/SUFI-XX/` con uno o varios run logs en formato Markdown.
- Los casos viven en Testmo (proyecto "SUFI Test"); este repo guarda solo los resultados de ejecución y los defectos.
- Los defectos se documentan bajo `reports/QA/bug-reports/` en español, con pasos para reproducir, comportamiento esperado vs. observado y evidencia.
- La evidencia visual (capturas de Storybook, preview y DevTools) se adjunta al ticket de Jira.

### 5.2. Estado futuro — Automatización con Playwright

A medida que el proyecto madura, parte de la cobertura manual se traslada a Playwright. La automatización no reemplaza la verificación visual humana en la fase de diseño, pero blinda la regresión una vez que un componente queda estable.

**Fases previstas de automatización:**

1. **Fase 0 — Validación de URLs (ya en marcha)**
   - Spec [tests/assets.spec.ts](../../../tests/assets.spec.ts) y CLI [src/validator.ts](../../../src/validator.ts) verifican que las URLs migradas y las redirecciones externas devuelvan HTTP 200 (siguiendo redirects; 404 termina la cadena).
   - Insumo: CSV en `./Resources/urls.csv`.
   - Reportes generados bajo `reports/*.{json,csv}` (no versionados).

2. **Fase 1 — Smoke automatizado sobre Storybook**
   - Carga de cada historia (story) del Storybook.
   - Validación de que el componente renderiza sin errores de consola.
   - Aserciones básicas sobre presencia de elementos clave (botones, texto, íconos).

3. **Fase 2 — Aserciones visuales y de estado**
   - Verificación de clases CSS aplicadas y atributos relevantes.
   - Simulación de hover, focus y click; aserciones sobre el cambio de estado.
   - Comparación de tokens computados (color de fondo, color de texto) contra los valores esperados del DS.

4. **Fase 3 — Regresión visual (snapshot testing)**
   - Capturas por story / por estado.
   - Diff visual contra baseline aprobado.
   - Umbrales de diferencia configurables por componente.

5. **Fase 4 — Integración con Contentful**
   - Variantes parametrizadas: el mismo test se ejecuta por cada valor relevante de un campo de Contentful.
   - Verificación de que la previsualización refleja el cambio de campo.

6. **Fase 5 — Accesibilidad automatizada**
   - Inyección de axe-core en cada story.
   - Falla del test ante violaciones de severidad serious o critical.

**Criterios para automatizar un caso:**

- El componente está estable y aprobado por diseño.
- El caso se ejecuta más de una vez (regresión, no exploración puntual).
- El resultado esperado es determinista y verificable programáticamente.
- El costo de mantenimiento del test es menor al costo de ejecutarlo manualmente cada release.

---

## 6. Niveles de prueba

| Nivel | Manual | Automatizado (objetivo) |
|---|---|---|
| Componente (Storybook) | ✅ Activo | 🔜 Fase 1–3 |
| Integración (Preview + Contentful) | ✅ Activo | 🔜 Fase 4 |
| Accesibilidad | ✅ Activo (axe DevTools, WAVE) | 🔜 Fase 5 |
| URLs y redirecciones | — | ✅ Activo (Fase 0) |
| E2E de flujos de negocio | 🔄 Exploratorio / en construcción | 🔜 Se formaliza cuando los flujos se estabilicen |

---

## 7. Tipos de prueba aplicados

- **Pruebas visuales** — verificación de tokens, estilos, espaciado y tipografía.
- **Pruebas funcionales del componente** — interacción, estados, animaciones.
- **Pruebas de integración con CMS** — Contentful controla la variante.
- **Pruebas de accesibilidad** — contraste, foco, semántica.
- **Pruebas de regresión** — re-ejecución de smoke por ticket cerrado.
- **Pruebas exploratorias** — sesiones libres sobre Storybook y preview para detectar defectos no cubiertos por casos formales.
- **Pruebas de URLs** — automatizadas con Playwright contra un CSV de URLs migradas.

---

## 8. Herramientas

- **Storybook** — navegador del sistema de diseño.
- **Navegador (Brave / Chromium)** con DevTools.
- **axe DevTools** y **WAVE** — extensiones para auditoría de accesibilidad.
- **Inspector de contraste** del navegador.
- **Figma** — verificación contra el DS.
- **Contentful** — manipulación de campos para validar variantes.
- **Testmo** — gestión de casos.
- **Jira** — tickets y trazabilidad.
- **Playwright** + **TypeScript** — automatización (actual: URLs; futuro: componentes).
- **Git / GitHub** — versionado del repo QA + validator.

---

## 9. Gestión de casos, ejecuciones y evidencia

- **Casos manuales:** Testmo, proyecto "SUFI Test". Exportes locales en `~/testmo-testcases/Projects/SUFI Test/` con patrón `{TICKET-ID}-TESTMO-{KIND}-{SUITE}.csv`.
- **Run logs de ejecución manual:** `reports/QA/manual-runs/SUFI-<id>/SUFI-<id>-YYYY-MM-DD-<slug>.md`. Un archivo por sesión. Cada caso se separa con `---`.
- **Defectos:** `reports/QA/bug-reports/`, en español, un archivo por defecto.
- **Planes de prueba y RFQA:** `reports/QA/test-plans/`.
- **Tests automatizados:** carpeta `tests/` del repo (Playwright recoge `**/*.spec.ts`).
- **Reportes automatizados:** `reports/*.{json,csv}` (no versionados).

---

## 10. Criterios de prioridad y severidad

**Prioridad del caso (heredada de Testmo):**

- **Critical** — bloquea funcionalidad principal del componente o impacta accesibilidad (contraste, foco).
- **High** — afecta el estilo, color o estado de un elemento visible al usuario.
- **Medium** — afecta detalles secundarios o estructura interna sin impacto directo en UX.
- **Low** — mejora deseable o ajuste cosmético menor.

**Severidad de defectos** (criterio operativo en Jira):

- **Bloqueante** — impide certificar el ticket.
- **Mayor** — desviación clara del diseño o accesibilidad.
- **Menor** — diferencia perceptible pero no crítica.
- **Trivial** — pulido fino.

---

## 11. Criterios de entrada y salida

**Entrada (un componente o ticket es certificable cuando):**

- Diseño aprobado en Figma (DS v1.0 o variante autorizada).
- Componente desplegado en Storybook y en preview.
- Criterios de aceptación documentados en el ticket de Jira.
- Casos de prueba creados en Testmo para el alcance del ticket.
- Acceso a Contentful disponible si el caso lo requiere.

**Salida (un ticket se cierra cuando):**

- Todos los casos en alcance ejecutados con resultado registrado.
- 100% de los casos Critical y High en estado Pass.
- Defectos abiertos clasificados; ninguno bloqueante sin plan.
- Run log archivado bajo `reports/QA/manual-runs/SUFI-<id>/`.
- Evidencia adjunta al ticket de Jira.

---

## 12. Roles y responsabilidades

- **QA Engineer (JCCoello):** diseño y ejecución de pruebas manuales, definición de casos en Testmo, documentación de defectos, mantenimiento del validador de URLs y de la suite Playwright a futuro.
- **Diseño:** aprobación visual y definición de tokens en Figma.
- **Desarrollo:** entrega de componentes estables en Storybook y preview, atención de defectos.
- **Product / PM:** priorización de tickets y aceptación funcional.
- **Content / Contentful:** configuración de entradas para validación de variantes.

---

## 13. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Divergencia entre Storybook y preview | Validar siempre los casos Critical / High en ambos entornos. |
| Cambios de tokens no comunicados | Cotejar contra Figma DS v1.0 en cada run; documentar token observado vs. esperado en defectos. |
| Falta de acceso a Contentful para QA | Solicitar acceso temprano; marcar casos como bloqueados hasta resolver. |
| Crecimiento del esfuerzo manual | Avanzar la automatización por fases (ver §5.2); priorizar componentes estables y de alto reuso. |
| Pérdida de trazabilidad entre Testmo y este repo | Mantener `SUFI-<id>` como identificador común en filenames, casos y tickets. |

---

## 14. Hoja de ruta de madurez

1. **Fase actual:** smoke manual por ticket sobre Storybook + preview, con run logs versionados y defectos en español. Validador de URLs activo.
2. **Próximo paso:** automatizar smoke sobre Storybook (Fase 1) para los componentes ya estables.
3. **Mediano plazo:** aserciones de estado y regresión visual (Fases 2–3).
4. **Largo plazo:** integración con Contentful en automatización y accesibilidad automatizada (Fases 4–5).
5. **Continuo:** el plan manual se mantiene como red de seguridad para casos nuevos, exploratorios y de UX fina.

---

## 15. Glosario

- **DS** — Design System (DS SuFi v1.0 en Figma).
- **Storybook** — entorno aislado de componentes.
- **Preview / test-dev** — sitio integrado con Contentful para verificación end-to-end visual.
- **Run log** — registro Markdown de la ejecución de una sesión de pruebas para un ticket.
- **RFQA** — Request For QA, brief recibido por el equipo QA para una iniciativa específica.
- **Testmo** — herramienta de gestión de casos manuales.
- **Token (de diseño)** — valor primitivo del DS (color, espaciado, tipografía).
