# QUALITY ENGINEERING STANDARDS & PRACTICES
# Apply — Project Test Plan

| Field | Value |
|---|---|
| **Document ID** | TP-SUFI-SUFI-2026-v0.1 |
| **Document Type** | Test Plan |
| **Engagement** | SUFI — Banitsimo Migration |
| **Approver** | Brayan Alvarado |
| **Contributors** | Juan Carlos Coello |
| **Status** | Draft |

---

## Revision History

| Version | Status | Date | Author |
|---|---|---|---|
| v0.1 | Initial draft | 2026-06-25 | Juan Carlos Coello |

---

## Table of Contents

1. References
2. Introduction
3. Test Items
4. Software Risk Issues
5. Features to be Tested
6. Features Not to be Tested
7. Approach
8. Item Pass / Fail Criteria
9. Suspension Criteria and Resumption Requirements
10. Test Deliverables
11. Remaining Test Tasks
12. Environmental Needs
13. Staffing and Training Needs
14. Responsibilities
15. Schedule
16. Planning Risks and Contingencies
17. Approvals

---

## 1. References

This Test Plan is aligned with the following references:

**IEEE 829**
[IEEE TEST PLAN TEMPLATE .pdf](https://standards.ieee.org/ieee/829/3787/)
*(Used as a reference example for how to complete each IEEE 829 section. This is not an Apply governing document.)*

**Apply Test Policy**
Quality Engineering — Test Policy v1.0 — Apply Digital

**Apply Test Strategy (Program Level)**
Quality Engineering — Test Strategy — Apply Digital

**Project Documentation / Requirements**
Notion: https://app.notion.com/p/apply-digital/Documentaci-n-SUFI-358b6f43e391803a9bfbe35421bdef9f

**Tracking & Test Management**
- JIRA Project / Board: https://reigncl.atlassian.net/jira/software/projects/SUFI/boards/791
- Test Management Tool (Testmo): https://applydigital.testmo.net/repositories/59

**Environments & Access**
- DEV: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/
- QA: https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/
- PROD: https://sufi-app.vercel.app/
- Storybook: https://sufi-acl.vercel.app/
- Shared Vercel password: `sufi-25-apply` (separate auth wall per environment)

**Automation Repository**
SUFI-url-validator (GitHub — Apply Digital)

**Design / UX**
Figma — DS SuFi v1.0: https://www.figma.com/design/pkXFvtuzYHGsMBsHAd9ubO/%F0%9F%94%B4-DS-SuFi-%E2%80%94-v1.0?node-id=0-1&p=f&t=clYXOWAwKN3whxaS-0

---

## 2. Introduction

This Test Plan defines the project-level approach to testing for the SUFI — Banitsimo Migration. It describes the scope of testing, test levels and types, environments, responsibilities, schedule, defect handling, and required deliverables to support release readiness decisions.

SUFI is a web product currently undergoing a rebrand and migration to Banitsimo. The solution is composed of a design system published in Storybook, a content-driven web application deployed on Vercel, and Contentful as the CMS controlling component variants, copy, and configuration. Testing focuses on ensuring visual and functional parity across environments, validating Contentful-driven variants, and confirming accessibility compliance before each release.

This document is a living artifact and will be updated throughout the project under revision control. It is consistent with Apply's Test Policy and the program-level Test Strategy, and serves as the execution baseline for all QE activities on this project.

The intended audience includes Engineering, Delivery/PM, Quality Engineering, and relevant client stakeholders.

---

## 3. Test Items

The following items are in scope for testing under this Test Plan:

**Product / Application:** SUFI Web App (Banitsimo — Design System & Content-Driven Web)

**Modules / Functional Areas:**
- Design System Components (Storybook — atoms, molecules, organisms)
- Preview / Integration Site (Contentful-driven pages and component rendering)
- Header Navigation and routing
- URL Migration & HTTP Redirect validation

**APIs / Services:**
- Contentful Content Delivery API (field-driven component variants and configuration)

**Integrations / External Dependencies:**
- Contentful CMS (content model, variant fields, publishing workflow)
- Vercel (deployment, branch previews — DEV / QA / PROD)

**Supported Platforms:**

The following browser and OS coverage represents Apply's default QE baseline. It may be adjusted based on client analytics, business requirements, or contractual agreements.

| Browser | Desktop | Tablet | Mobile |
|---|---|---|---|
| Chrome (latest stable + up to 2 prev. major) | ✅ Mandatory | ✅ Mandatory | ✅ Mandatory |
| Safari (latest stable + up to 2 prev. major) | ✅ Mandatory | ✅ Mandatory | ✅ Mandatory |
| Edge (latest stable + up to 2 prev. major) | ✅ Mandatory | — | — |
| Firefox (latest stable + up to 2 prev. major) | ✅ Mandatory | — | — |

**Viewports of reference:**
- Desktop: 1440 × 900 (primary design reference); secondary 1280 × 800
- Tablet: 1024 × 768 (landscape) and 768 × 1024 (portrait)
- Mobile: 390 × 844 (iPhone 14/15 base) and 360 × 800 (Android base)

**Notes:**
- Browser/viewport coverage in manual runs is simulated via DevTools responsive mode unless a case requires a physical device.
- Automation (Playwright) targets `chromium`, `webkit`, and `msedge` projects with corresponding device presets.

---

## 4. Software Risk Issues

Testing priorities are driven by risk. The following software risks have been identified and will be actively managed throughout delivery:

| Risk | Impact | Likelihood | Mitigation / Test Focus |
|---|---|---|---|
| Visual/functional divergence between Storybook and the Preview site | High | Medium | Validate all Critical/High cases in both environments; document any divergence as a defect |
| Design token changes not communicated to QE | High | Medium | Cross-reference Figma DS SuFi v1.0 on each run; log observed vs. expected token in defect reports |
| Contentful access unavailable for QA validation | Medium | Medium | Request access early per sprint; mark affected cases as Blocked until resolved |
| Accessibility non-compliance (contrast, focus, semantics) | High | Medium | WCAG 2.2 AA checks (axe DevTools + manual) on every Critical/High component; evidence attached per ticket |
| Manual testing effort growing faster than automation coverage | Medium | High | Progress automation by phases (Storybook smoke → state assertions → visual regression); prioritize stable, high-reuse components first |
| Traceability gaps between Testmo cases and run log evidence | Low | Low | Keep `SUFI-<id>` as the common identifier across Testmo, Jira tickets, and run log filenames |

---

## 5. Features to be Tested

The following features are in scope for this Test Plan. The list may evolve based on delivery changes and risk assessment.

**Core User Journeys**
- Component-level interaction (normal, hover, active, focus, disabled states; cursor behavior; animations and transitions)
- CMS-driven content rendering: Contentful field changes reflected in the Preview site without code deployment
- Header navigation: link routing, responsive collapse/expand, keyboard navigation

**Key Functional Areas**
- Design System components published in Storybook (all stories within the SUFI-Banitsimo scope)
- Contentful field-driven variant configuration (e.g., button color, component state overrides)
- URL migration and HTTP redirect validation (automated — CLI + Playwright spec)

**Integrations**
- Contentful CMS: content model fields controlling component variants, copy, and configuration
- Storybook ↔ Preview parity: design system components rendering consistently in both environments

**Non-Functional Requirements (as applicable)**
- **Accessibility:** WCAG 2.2 AA — no Critical or Serious axe violations; text contrast ≥ 4.5:1 in normal, hover, and active states; visible keyboard focus on all interactive elements.
- **Performance:** Lighthouse score ≥ 90 (minimum) on key flows as a baseline signal. Results impacted by third-party services or external variability will be documented with context.

---

## 6. Features Not to be Tested

The following items are out of scope unless explicitly agreed with stakeholders:

- Backend performance engineering and infrastructure tuning
- Security audits / penetration testing (unless formally included and resourced)
- SEO validation beyond basic functional checks
- Physical device testing beyond the browser/viewport matrix defined in §3
- CMS content accuracy: QE validates content presence and correct rendering. Copy correctness, translations, and editorial validation are owned by content authors.
- Formal accessibility certification: QE identifies WCAG-related issues and improves compliance. Legal compliance guarantees are not in QE scope.
- Production support outside post-release smoke validation

Out-of-scope items may be revisited based on risk, client requirements, or delivery changes.

---

## 7. Approach

Testing for this project follows Apply's Test Strategy and uses a risk-based approach to prioritize effort on critical components, CMS integrations, and high-impact user journeys.

**Testing activities include:**

- **Shift-Left validation:** review of acceptance criteria and testability before execution begins; design QA against Figma DS SuFi v1.0 when applicable.
- **Component testing (Storybook):** validate all published stories for visual accuracy (tokens, typography, spacing), interactive states, Contentful-driven variants, animations, and accessibility.
- **Integration testing (Preview site):** validate that Contentful field changes propagate correctly to the Preview environment without code deployment.
- **System testing (E2E):** validate end-to-end workflows (navigation, routing, URL redirects) against acceptance criteria.
- **Regression testing:** smoke and regression suites executed per release to confirm stable functionality is not impacted by changes.
- **Exploratory testing:** structured sessions on Storybook and Preview to surface edge cases, usability issues, and unexpected behavior not covered by formal cases.
- **Accessibility & performance validation:** Lighthouse baseline (target ≥ 90) plus axe DevTools and WAVE for WCAG 2.2 AA compliance.

Automation is prioritized for URL validation (active), Storybook smoke (next phase), and critical regression flows, with depth expanding as components stabilize.

**Automation phases:**
1. **Phase 0 (active):** URL migration and redirect validation (Playwright + CLI)
2. **Phase 1 (next):** Storybook smoke — component loads, no console errors, key elements present
3. **Phase 2:** State assertions (CSS classes, attributes, hover/focus/click behaviors)
4. **Phase 3:** Visual regression (snapshot diff against approved baseline)
5. **Phase 4:** Contentful-parametrized variant testing
6. **Phase 5:** Automated accessibility (axe-core injected per story; fail on Serious/Critical violations)

**AI Support (as applicable)**
When permitted by client security policies, QE leverages AI-enabled tools (Claude Code) to support:
- Test case generation from acceptance criteria
- Run log and Jira comment authoring
- Defect triage support through log summarization
- Regression prioritization based on change impact

All AI outputs are human-reviewed before use as testing evidence or release readiness decisions.

---

## 8. Item Pass / Fail Criteria

**Pass Criteria**

An item is considered PASS when:
- All in-scope test cases for the ticket have been executed
- All Critical and High cases are in Pass state
- 0 open Blocker defects remain
- Any Major defects are explicitly risk-accepted and documented
- Regression for impacted areas is completed
- Accessibility baseline meets WCAG 2.2 AA for in-scope components (no Critical/Serious axe violations)
- Run log is archived and evidence is attached to the Jira ticket

**Fail Criteria**

An item is considered FAIL when:
- Any Blocker defect remains open with no approved workaround
- Critical user journeys or core component states are failing
- High residual risk exists without explicit stakeholder risk acceptance
- Testing scope cannot be executed due to unresolved environment or dependency blockers

---

## 9. Suspension Criteria and Resumption Requirements

**Suspension Criteria**

Testing may be suspended when:
- The target environment (Storybook, Preview, Contentful) is unstable or unavailable
- Required Contentful access is not available for cases that depend on it
- Build instability prevents meaningful validation
- Critical defect volume requires stabilization before continuing execution

**Resumption Requirements**

Testing may resume when:
- Environmental and Contentful stability is restored
- Fixes are deployed and the retest scope is agreed upon with Engineering
- Testing priorities and scope are reconfirmed with PM/Delivery

---

## 10. Test Deliverables

The following deliverables will be produced and maintained throughout the project:

- Test Plan (versioned — this document)
- Test cases and suites (Testmo, repository 59)
- Test execution results and evidence (run logs under `reports/QA/manual-runs/SUFI-<id>/`)
- Defects logged in JIRA with traceability to Testmo cases and Figma specs
- Automation suites (Playwright — `tests/*.spec.ts`) and CI reports
- Regression scope (risk-based, per release)
- Accessibility summary (WCAG 2.2 AA) per major release
- Performance baseline summary (Lighthouse ≥ 90) per major release
- Release readiness summary (Go / Go with risk / No-Go)

---

## 11. Remaining Test Tasks

- Test case creation and maintenance in Testmo (per new tickets)
- Playwright automation expansion: Phase 1 (Storybook smoke) for stable components
- Regression scope updates based on change impact and risk per sprint
- Test data / Contentful entry preparation as new component variants land
- Environment readiness monitoring and stability follow-ups
- Accessibility and performance validation execution per major release
- Defect retesting and regression confirmation after fixes

---

## 12. Environmental Needs

| Environment | URL | Purpose |
|---|---|---|
| DEV | https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/ | Early integration validation |
| QA | https://sufi-app-git-qa-apply-digital-sandbox.vercel.app/ | Primary test execution environment |
| PROD | https://sufi-app.vercel.app/ | Post-release smoke validation |
| Storybook | https://sufi-acl.vercel.app/ | Isolated component-level testing |
| Contentful | SUFI space | CMS field-driven variant configuration |

**Access requirements:**
- Shared Vercel password: `sufi-25-apply` (entered independently per environment)
- Contentful editor access required for variant validation cases
- Figma view access: DS SuFi v1.0

**Test data:**
- Contentful entries for each component variant to be tested
- URL migration CSV (`./Resources/urls.csv`) for redirect validation

---

## 13. Staffing and Training Needs

**Staffing**
- QE: Juan Carlos Coello (juancarlos.coello@applydigital.com)
- Tech Lead (Engineering support): Martín Roldán
- PM / Delivery: Nathalie Ramos

**Training**
No additional training required for current QE resources. Playwright automation knowledge is in place.

---

## 14. Responsibilities

Quality Engineering is responsible for defining and executing the testing approach for the project in alignment with Apply's Test Policy and Test Strategy. QE owns the planning, coordination, and communication of quality signals, ensuring that testing scope remains risk-based and focused on critical components, CMS integrations, and high-impact flows.

QE drives Shift-Left practices throughout the SDLC by reviewing acceptance criteria for testability, identifying risks before execution begins, and validating design compliance against Figma DS SuFi v1.0.

While QE leads testing execution and quality governance, quality is a shared responsibility:

| Role | Responsibility |
|---|---|
| QE (Juan Carlos Coello) | Test design, execution, defect reporting, run log archiving, automation maintenance |
| Engineering (Martín Roldán) | Stable component delivery in Storybook and Preview, timely defect resolution |
| PM / Delivery (Nathalie Ramos) | Ticket prioritization, release decisions, risk acceptance |
| Content / Contentful Authors | CMS entry configuration for variant coverage; content accuracy |

---

## 15. Schedule

Testing activities are executed continuously throughout delivery, aligned with the Kanban flow (no fixed sprints).

- **Shift-Left activities:** ongoing during discovery, refinement, and design
- **Component / integration testing:** executed as tickets are deployed to Storybook and Preview
- **Regression / smoke:** executed per release and on-demand based on change impact
- **Accessibility & performance validation:** executed on key flows per major release
- **Automation expansion (Phase 1 — Storybook smoke):** target: stable components confirmed by Engineering
- **Release readiness checkpoint:** completed before each PROD deployment

Detailed timelines and test runs are tracked in the JIRA board and Testmo.

---

## 16. Planning Risks and Contingencies

| Risk | Mitigation |
|---|---|
| Storybook or Preview environment instability | Prioritize critical flows; reschedule impacted runs; escalate to Martín Roldán |
| Contentful access unavailable for QA | Request access early per ticket; mark cases as Blocked; escalate to PM |
| Unclear or missing acceptance criteria | Apply Shift-Left review; log requirement gaps in Jira; adjust scope until clarified |
| Token / design changes not communicated | Cross-reference Figma DS SuFi v1.0 on each run; treat unexplained deviations as defects pending clarification |
| High defect volatility near release | Trigger suspension criteria; retest fixes; run targeted regression before readiness decision |
| Automation instability during expansion | Maintain manual coverage as safety net; gate automation on component stability sign-off |

---

## 17. Approvals

This Test Plan becomes effective once reviewed and approved by the following roles:

| Role | Name | Date |
|---|---|---|
| Quality Engineer | Juan Carlos Coello | |
| Approver (QE) | Brayan Alvarado | |
| Project Lead / Delivery | Nathalie Ramos | |
| Tech Lead | Martín Roldán | |
| Client Representative | *(Pending)* | |
