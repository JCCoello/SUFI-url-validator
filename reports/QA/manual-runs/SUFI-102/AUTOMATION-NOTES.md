# SUFI-102 — Automation Notes

## What was built

Fully automated Playwright smoke spec covering all 8 ACs of SUFI-102 (new color sub-tones: medium + light per tonality).

| File | Purpose |
|------|---------|
| `tests/sufi-102.spec.ts` | The spec — 8 tests, one per AC |
| `playwright.smoke.config.ts` | Separate Playwright config (does not trigger URL validator globalSetup) |
| `.env.local` | Credentials — gitignored, never committed |

**Run command:** `npm run test:smoke:sufi102`

---

## What each AC verifies

| AC | Surface | Check |
|----|---------|-------|
| AC1 | Storybook Foundation Colors docs | All `{color}-medium` and `{color}-light` tokens visible in the preview iframe |
| AC2 | Storybook Card controls | `backgroundColor` select contains all 12 new sub-tone options |
| AC3 | Storybook Promotional Card controls | Same as AC2 |
| AC4 | Contentful Card entry (development) | `Background Color` field lists all 12 new sub-tone options |
| AC5 | Contentful Promotional Card entry (development) | Same as AC4 |
| AC6 | DEV `/test-dev` desktop | Card has non-transparent background, no component console errors |
| AC7 | DEV `/test-dev` desktop | Promotional Card has non-transparent background, no component console errors |
| AC8 | DEV `/test-dev` tablet (768px) + mobile (375px) | Both components visible, within viewport width, no component errors |

---

## Key technical notes

### Contentful login
- URL: `https://be.contentful.com/login`
- Single-step form — email + password on same page
- Selectors: `[data-test-id="email-input"]`, `[data-test-id="password-input"]`, `[data-test-id="login-button"]`
- After `.click()` use `waitForLoadState('networkidle')` — **not** `waitForURL` (SPA doesn't change URL cleanly)
- Credentials in `.env.local` as `CONTENTFUL_EMAIL` / `CONTENTFUL_PASSWORD`

### Contentful backgroundColor field
- Rendered inside a **cross-origin iframe** (`ctfcloud.net`, `data-test-id="cf-widget-renderer"`)
- Access: `page.getByRole('group', { name: 'Background Color' }).frameLocator('iframe').getByRole('combobox')`
- **Do not** use `waitForLoadState('networkidle')` after navigating to an entry — Contentful makes continuous background requests and it never resolves
- **Do** `await bgSelect.waitFor({ timeout: 15000 })` before reading options to let the iframe stabilize

### Storybook controls panel
- `backgroundColor` control is a native `<select>` inside a `<table>` row
- Use `.filter({ has: page.getByRole('cell', { name: 'backgroundColor', exact: true }) })` — the `/backgroundColor/` regex matches 3 rows (other rows reference it in their RAW values)

### DEV component selectors (confirmed via DOM inspection)
- Card: `[class*="ml-card__vertical-start"]`
- Promotional Card: `[class*="or-promotional-card__horizontal-container"]`

### Annotated screenshots
All screenshots use `annotateAndScreenshot(page, locator, path, label)` — injects a red border + arrow label over the target element before capturing.

---

## Screenshots
- `sufi102-AC1-foundation-colors.png`
- `sufi102-AC2-card-storybook-control.png`
- `sufi102-AC3-promo-card-storybook-control.png`
- `sufi102-AC4-card-contentful-field.png`
- `sufi102-AC5-promo-contentful-field.png`
- `sufi102-AC6-card-dev-desktop.png`
- `sufi102-AC7-promo-card-dev-desktop.png`
- `sufi102-AC8-tablet.png`
- `sufi102-AC8-mobile.png`
