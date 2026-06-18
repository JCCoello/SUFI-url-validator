# CLAUDE.md — SUFI Web App

## Who you're working with
Juan Carlos Coello, QA engineer on the SUFI project at Apply Digital.
- Outputs go directly into Jira or Testmo — format and paste-readiness matter more than explanation.
- Comfortable with DevTools, Git, and the command line. Don't over-explain basics.
- Terse is better. One sentence beats a paragraph.

## Language
- **Deliverables** (run logs, Jira comments, defect reports, anything pasted into a ticket) → **Spanish**
- **Chat conversation** → **English**

## Environments

| Env | URL | Branch | Contentful |
|-----|-----|--------|------------|
| DEV | https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/ | `dev` | Development |
| QA | https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ | `qa` | Master (Draft) |
| PROD | https://sufi-app.vercel.app/ | `main` | Master (Published) |
| Storybook | https://sufi-acl.vercel.app/ | — | — |

Shared Vercel password: `sufi-25-apply` (DEV, QA, PROD, and Storybook each have a separate auth wall).

## QA smoke run workflow
Test cases are authored and tracked in **Testmo**. Run logs and defect reports live in the separate `SUFI-url-validator` repo under `reports/QA/`.

When a smoke run is confirmed ("All good with SUFI-XX"), ask whether to run Playwright automated checks before doing anything — don't assume.

### When Playwright automation is approved
1. Use `generator_setup_page` to start the browser session.
2. Authenticate with `sufi-25-apply` on each Vercel auth wall (DEV, Storybook, and PROD are separate).
3. Dismiss any auto-opening modals with Escape before testing other components.
4. Work through each AC: DOM/ARIA checks via `evaluate`, sticky positioning via `getBoundingClientRect()` before/after `scrollTo()`, smooth scroll via `element.click()` + scrollY delta, keyboard via `element.focus()` + `Enter`.
5. **Screenshot naming:** `sufi{XX}-AC{N}-descriptor.png` — AC prefix in every filename.
6. **AC badge overlay:** inject a fixed `<div id="__qa-label">` (red `#D32F2F`, white monospace, top-right) before each screenshot showing the AC label (e.g. `AC3 — sticky`). Remove and re-inject between screenshots.
7. Run log title when Playwright was used: `# SUFI-XX — Smoke: Manual + Playwright (run log)`. Pure manual runs use `Manual Smoke`.
8. Add an automated verification table and screenshots table to the run log Notes section.
9. If a check fails or blocks, skip it and move on.

### Jira pass comment format
```
**SUFI-XX — Smoke Manual ✅ N/N Pass**
**Fecha:** YYYY-MM-DD **Tester:** JCCoello (juancarlos.coello@applydigital.com)

**Entorno:**
- [env URLs]

**Resultado global:** ✅ N/N Pass — sin defectos encontrados.

---

**1. [Nombre del caso]**
**Prioridad:** XX · **Resultado:** ✅ Pass
- **GIVEN** ...
- **WHEN** ...
- **THEN** ...
- **Esperado:** ...
- **Observado:** ...

---

**Notas:**
- Sin defectos encontrados durante esta sesión.
- Evidencia adjunta (listar archivos PNG + video).
```

Use `---` between every case. Output as plain markdown (no code block wrapper) so Jira renders it as rich text.

## Before running external commands
Always state what a command will do before executing it when it contacts external systems (Jira, Slack, APIs, Vercel, etc.) or is irreversible. Ask for confirmation first.
