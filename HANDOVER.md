# SUFI QA Handover — July 6–12, 2026

**Covering for:** Juan Carlos Coello (juancarlos.coello@applydigital.com)  
**Project:** SUFI web app — Apply Digital  
**Scope:** QA only (smoke testing, defect reporting)

---

## Key Contacts

| Role      | Name           |
| --------- | -------------- |
| PM        | Nathalie Ramos |
| Tech Lead | Martín Roldán  |

If you find a defect, create a Jira ticket and ping **Martín** directly.

---

## Tools & Access

| Tool                | Link                                                                 | Notes                                             |
| ------------------- | -------------------------------------------------------------------- | ------------------------------------------------- |
| Jira board          | https://reigncl.atlassian.net/jira/software/projects/SUFI/boards/791 | May migrate to Azure DevOps — check with Nathalie |
| Testmo (test cases) | https://applydigital.testmo.net/repositories/59                      | All SUFI manual test cases live here              |
| This repo           | `SUFI-url-validator`                                                 | Run logs + Playwright specs                       |

---

## Environments

| Env       | URL                                                        |
| --------- | ---------------------------------------------------------- |
| DEV       | https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/ |
| QA        | https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/  |
| PROD      | https://sufi-app.vercel.app/                               |
| Storybook | https://sufi-acl.vercel.app/                               |

**Shared Vercel password:** `sufi-25-apply`  
Each environment has a **separate** auth wall — enter the password on each one independently.

---

## Day-to-Day Workflow

### 1. Pick up a ticket

- Pull from the Jira board (Kanban — no fixed sprint)
- Find the test cases for that ticket in Testmo (repository 59)

### 2. Run the tests

**Manual:**  
Work through each acceptance criterion using the environments above. Log pass/fail in Testmo.

**Automated (Playwright):**  
Some tickets already have specs written in the `tests/` folder. To run one:

```bash
npx playwright test tests/<spec-name>.spec.ts
```

Current specs:

| Spec file                | Coverage          |
| ------------------------ | ----------------- |
| `sufi-102.spec.ts`       | SUFI-102          |
| `sufi-108-smoke.spec.ts` | SUFI-108          |
| `sufi-110.spec.ts`       | SUFI-110          |
| `header-nav.spec.ts`     | Header navigation |

If a spec doesn't exist for your ticket, run it manually.

### 3. Write the Jira pass comment

You don't need a special tool for this — just describe what you tested to **Claude Code** (the AI assistant in this repo) and it will generate the formatted comment for you.

**How to open Claude Code:**

```bash
cd SUFI-url-validator
claude
```

**What to tell it:**

> "I just ran a smoke test for SUFI-XXX. The ticket is about [brief description]. I tested [environments]. All ACs passed: AC1 [what you checked], AC2 [what you checked], etc."

Claude will output a ready-to-paste Jira comment in the correct format. Copy it and post it as a comment on the Jira ticket.

### 4. Log the run

Run logs live in `reports/QA/`. After each run, Claude Code will generate a run log file — commit it and push:

```bash
git add reports/QA/
git commit -m "add SUFI-XXX smoke run log"
git push
```

---

## Defect Reporting

1. Create a new Jira ticket in the SUFI project
2. Link it to the parent story
3. Ping **Martín Roldán** on Slack with the ticket link

---

## Notes

- Claude Code has full context on the SUFI project — if something isn't clear, just ask it
- The Jira board URL may change to Azure DevOps mid-week; Nathalie or Martín will communicate this
- Storybook is used for component-level checks — URL is https://sufi-acl.vercel.app/ (same Vercel password)
