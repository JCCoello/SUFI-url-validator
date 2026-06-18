# Base de Conocimiento — QA SUFI / Banistmo Migration

> Documento para alimentar el proyecto NotebookLM del QE. Consolida el contexto del proyecto, flujos de trabajo, tooling, entornos y estado de la automatización.

---

## 1. Contexto del Proyecto

**Proyecto:** SUFI / Banistmo Migration  
**Cliente:** SUFI (producto financiero) — migración de plataforma web desde Banistmo  
**Empresa:** Apply Digital  
**QE responsable:** Juan Carlos Coello (juancarlos.coello@applydigital.com)

El proyecto consiste en migrar el sitio web de SUFI a una nueva arquitectura (Next.js / Vercel + Contentful como CMS). El QE es responsable de validar que el contenido, la navegación, los componentes y las integraciones funcionen correctamente en los distintos entornos durante el proceso de migración.

---

## 2. Propósito del Repositorio

Este repositorio (`SUFI-url-validator`) cumple **dos funciones simultáneas**:

### 2.1 Herramienta de Validación Automatizada
- Validador de URLs migradas: verifica que cada URL del CSV retorne HTTP 200 (siguiendo redirects; 404 se trata como falla terminal).
- Suite de Playwright con specs para: validación de assets (`tests/assets.spec.ts`), navegación del header (`tests/header-nav.spec.ts`), seed de datos (`tests/seed.spec.ts`), y specs de smoke por ticket (`tests/sufi-102.spec.ts`, `tests/sufi-110.spec.ts`, etc.).
- CLI standalone: `src/validator.ts` consume un CSV en `./Resources/urls.csv`.
- Config separada `playwright.smoke.config.ts` para los specs de smoke (no dispara el `globalSetup` del validador de URLs).
- Scripts npm: `test:smoke` (todos los smokes), `test:smoke:sufi102`.

### 2.2 Hub de QA del Equipo
- `reports/QA/manual-runs/` — logs de ejecución de smoke tests manuales, organizados por ticket (`SUFI-<id>/`).
- `reports/QA/bug-reports/` — reportes de defectos encontrados durante las ejecuciones.
- `reports/QA/test-plans/` — planes de prueba por feature o release.

**Importante:** Este repositorio es un repo QA independiente. **No vive dentro del repo de la aplicación SUFI** (el repo de la app está alojado en otro lugar). Esta separación es la causa raíz del desafío de integración CI/CD descrito más adelante.

---

## 3. Stack Técnico

| Herramienta | Uso |
|---|---|
| Playwright | Framework de automatización E2E y validación HTTP |
| TypeScript | Lenguaje del código de automatización |
| Allure | Reportes de resultados de tests |
| GitHub Actions | CI/CD del repo QA (manual/schedule) |
| Testmo | Gestión de casos de prueba manuales (sistema de registro) |
| Jira | Seguimiento de tickets y defectos |
| Contentful | CMS del sitio SUFI (Development + Master environments) |
| Vercel | Hosting del sitio SUFI (preview + producción) |
| BMAD | Tooling de metodología QE (instalado en el repo) |

---

## 4. Entornos

### DEV (desarrolladores + QA)
- **URL base:** `https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/`
  - Nota: el path exacto varía por ticket/feature; verificar en el CSV de turno.
- **Contentful:** entorno Development
- **Branch de la app:** `dev`

### QA (autores de contenido)
- **URL base:** `https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/`
- **Contentful:** Master (contenido en estado Draft/Changed)
- **Branch de la app:** `qa`

### PROD (spare — sin uso real activo aún)
- **URL base:** `https://sufi-app.vercel.app/`
- **Contentful:** Master (contenido Published)
- **Branch de la app:** `main`

**Contraseña compartida para todos los entornos:** `sufi-25-apply`

**Nota sobre Contentful:** SUFI trabaja provisionalmente dentro del space de Contentful de Apply (entornos Development + Master, modelo Bancolombia/Banistmo). Todo migrará al space propio de SUFI una vez que obtengan su licencia.

---

## 5. Flujo de Trabajo QA

### 5.1 Casos de Prueba — Testmo
Los casos de prueba manuales viven en **Testmo**. Las exportaciones locales se encuentran en:

```
~/testmo-testcases/Projects/SUFI Test/
```

Archivos conocidos:
- `SUFI-36-TESTMO-MANUAL-SMOKE.csv`
- `SUFI-47-TESTMO-MANUAL-SMOKE.csv`
- `SUFI-70-TESTMO-MANUAL-SMOKE.csv`
- `SUFI-78-TESTMO-MANUAL-SMOKE.csv`

Testmo es el **sistema de registro** para la definición de casos. No se duplican en este repo.

### 5.2 Logs de Ejecución — Este Repo
Los resultados de cada sesión de testing se documentan en:

```
reports/QA/manual-runs/SUFI-<id>/SUFI-<id>-YYYY-MM-DD-<slug>.md
```

Formato del archivo: un caso por sección, separados por `---`. Cada caso incluye: ID Testmo, descripción, resultado (PASS/FAIL), notas de evidencia.

**Tickets completados (con run log en el repo):**

| Ticket | Fecha | Tipo | Resultado |
|--------|-------|------|-----------|
| SUFI-35, 40, 41, 68, 69 | 2026-06-09/10 | Manual | ✅ Pass |
| SUFI-70, 71, 73, 78, 79, 84, 85 | 2026-06-11 | Manual | ✅ Pass |
| SUFI-67 | 2026-06-12 | Manual + Playwright | ✅ Pass |
| SUFI-72 | 2026-06-12 | Manual | ✅ Pass |
| SUFI-74 | 2026-06-10 | Manual | ✅ Pass |
| SUFI-75 | 2026-06-12 | Manual | ⚠️ Defectos encontrados |
| SUFI-98 | 2026-06-12 | Manual | ✅ Pass |
| SUFI-96 | 2026-06-15 | Manual + Playwright | ✅ Pass |
| SUFI-97 | 2026-06-15 | Manual + Playwright | ✅ Pass |
| SUFI-99 | 2026-06-15 | Manual + Playwright | ✅ Pass |
| SUFI-77 | 2026-06-16 | Manual | ✅ Pass |
| SUFI-101 | 2026-06-16 | Manual | ✅ Pass |
| SUFI-102 | 2026-06-16/17 | Playwright automatizado | ✅ Pass |
| SUFI-103 | 2026-06-17 | Manual + Playwright | ✅ Pass |
| SUFI-110 | 2026-06-18 | Manual + Playwright | ✅ Pass |

### 5.3 Defectos
Los bugs encontrados durante las ejecuciones se documentan en:

```
reports/QA/bug-reports/
```

Como archivos markdown individuales. Los defectos también se registran en Jira (el QE pega el contenido formateado directamente en el ticket).

### 5.4 Foco del Smoke Testing Manual
Actualmente centrado en la integración Storybook ↔ preview web: verificar que los componentes rendericen correctamente en ambas superficies durante la migración.

---

## 6. Estado Actual de la Automatización

### Lo que existe hoy:
- `tests/header-nav.spec.ts` — verifica que todos los links del header retornen HTTP 200. Se conecta al PROD preview (`sufi-app.vercel.app`) con manejo del password screen de Vercel.
- `tests/assets.spec.ts` — valida URLs/assets contra un CSV.
- `tests/seed.spec.ts` — spec de seed de datos.
- `tests/sufi-102.spec.ts` — smoke completamente automatizado para SUFI-102 (8 ACs: color sub-tones medium/light). Cubre Storybook Foundation Colors, controls panel de Card y Promotional Card, campos de Contentful vía iframe cross-origin, y renderizado en DEV (desktop, tablet, mobile). Screenshots anotados con borde rojo + etiqueta overlay.
- `tests/sufi-110.spec.ts` + `tests/sufi-110-news-card-smoke.spec.ts` + `tests/sufi-110-seed.spec.ts` — suite de smoke para SUFI-110 (componente News Card).
- `playwright.smoke.config.ts` — config separada para specs de smoke (no dispara `globalSetup` del validador).
- `src/validator.ts` — CLI de validación de URLs desde CSV.
- GitHub Actions workflow (`validate-assets.yml`) — disparo manual (`workflow_dispatch`) o por push a branches `validate/**`. Solo corre el validador de assets, no los specs de Playwright.

### Patrones de automatización establecidos:
- **Contentful login:** form single-step, `waitForLoadState('networkidle')` post-click, credenciales en `.env.local` (gitignored).
- **Campo iframe de Contentful:** acceso vía `frameLocator('[data-test-id="cf-widget-renderer"]')`, `waitFor({ timeout: 15000 })` antes de leer opciones (no usar `networkidle` en navegación a entries).
- **Storybook controls panel:** `<select>` nativo en `<table>`, filtrar por celda exacta para evitar matches múltiples.
- **Storybook iframe directo:** `/iframe.html?id=...&viewMode=story` para viewport full-width sin shell panel.
- **Screenshots anotados:** helper `annotateAndScreenshot()` — inyecta borde + overlay `<div id="__qa-label">` antes de capturar, lo remueve entre capturas.

### Lo que NO existe aún:
- Tests de accesibilidad (WCAG/axe).
- Ejecución automática en schedule.
- Publicación de reportes Allure para visibilidad de stakeholders.
- Trazabilidad entre specs y casos Testmo (anotaciones `allure.tms()`).

---

## 7. Situación CI/CD — Contexto y Decisiones Pendientes

### El problema central
Este repo es independiente del repo de la aplicación SUFI. Eso significa que:
- No puede bloquear un deploy o un PR en la app.
- No hay un "quality gate" real en el pipeline de la aplicación.
- Los specs corren manualmente o (potencialmente) en schedule, pero no como gate automático.

### Discusión con el equipo (2026-06-11)
Se llevó la problemática al equipo (Martín, Marcelo). Puntos clave del resultado:
- La automatización sí estaba en el scope del proyecto.
- Martín sugirió crear un **repositorio nuevo dentro del proyecto** (contexto Azure) y evaluar alternativas si no es posible.
- Marcelo coordinará con Hernán para obtener el acceso necesario.
- **Decisión pendiente:** confirmar si el repo nuevo vivirá en Azure DevOps o GitHub, lo cual define el tooling de CI (Azure Pipelines vs. GitHub Actions).

### Opciones en evaluación
1. **Opción A (preferida):** Nuevo repo dentro del proyecto con acceso al pipeline → automatización se convierte en quality gate real.
2. **Opción B (contingencia):** Mantener repo independiente con ejecución en schedule + comunicación proactiva del QE antes de cada release.

---

## 8. Alineación con los Nuevos Estándares QE (WoWs de Apply)

Los nuevos Ways of Working de Apply QE establecen las siguientes expectativas clave y su estado actual:

| Expectativa WoW | Estado actual | Brecha / Acción |
|---|---|---|
| Automation-first | Parcial — existen specs pero no corren en CI automático | Resolver con repo en proyecto |
| CI/CD como quality gate | No implementado | Pendiente de decisión de equipo |
| Minimizar trabajo manual repetitivo | Smoke runs aún son manuales y repetitivos | Migrar casos manuales a specs |
| Accesibilidad por defecto (WCAG) | Sin cobertura automatizada | Agregar axe-playwright |
| Trazabilidad (requisitos ↔ casos ↔ automatización) | Sin link entre specs y Testmo IDs | Agregar anotaciones allure.tms() |
| AI-assisted QE | Claude/BMAD instalado y en uso | Bien alineado |
| Visibilidad de resultados para stakeholders | Allure solo local; no publicado | Publicar reportes |
| Engagement shift-left | Comportamental — no depende del repo | Participación en refinement/discovery |

**Limitación documentada:** La integración CI/CD como quality gate real requiere que el equipo de desarrollo abra acceso al pipeline de la aplicación. Esta limitación está justificada y debe constar en el Test Plan como riesgo gestionado.

---

## 9. Equipo y Stakeholders

| Persona | Rol |
|---|---|
| Juan Carlos Coello | QE — responsable del testing y automatización |
| Martín | Tech Lead — aprueba decisiones técnicas de estructura de repos |
| Marcelo | Punto de contacto para gestionar acceso con Hernán |
| Hernán | Stakeholder técnico con acceso al entorno Azure del proyecto |
| Andreina | Acceso de edición en Contentful Master |
| Pepe | Acceso de edición en Contentful Master |

---

## 10. Próximos Pasos

- [ ] Esperar respuesta de Marcelo/Hernán sobre acceso al repositorio en Azure.
- [ ] Confirmar si el repo nuevo será Azure DevOps o GitHub.
- [ ] Definir qué specs se migran primero al repo del proyecto.
- [ ] Agregar axe-playwright para checks de accesibilidad.
- [ ] Agregar anotaciones `allure.tms()` para trazabilidad con Testmo.
- [ ] Publicar reportes Allure en alguna superficie accesible para el equipo.
- [ ] Continuar smoke runs para tickets pendientes en el backlog.

---

*Última actualización: 2026-06-18*
