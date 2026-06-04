# SUFI URL Validator

Automated URL / redirect validation for the **SUFI / Banitsimo migration**. Reads a CSV of
URLs and asserts each returns **HTTP 200** after following redirects, plus a Playwright suite
that checks header navigation links on the live preview environment.

## What it does

| Suite | What it checks | File |
|---|---|---|
| **URL batch** | Every URL in the CSV returns HTTP 200 (redirects followed; 404 is terminal) | `tests/assets.spec.ts` |
| **Header links** | Every `<a href>` in the preview site header responds with HTTP 200 | `tests/header-nav.spec.ts` |

The same core logic is also exposed as a standalone CLI (`src/validator.ts`) for release-batch runs.

---

## Setup

### 1. Prerequisites

- Node.js 18+
- npm 9+

### 2. Install dependencies

```bash
npm install
npx playwright install chromium
```

> `tests/header-nav.spec.ts` drives a real browser, so Chromium must be installed.
> The CSV/CLI validation (`tests/assets.spec.ts`) makes plain HTTP requests and needs no browser.

### 3. Configure environment

```bash
cp .env.example .env
```

The preview deployments are behind **Vercel password protection**. Set the visitor password:

```env
VERCEL_BYPASS_TOKEN=<vercel visitor password>
```

The validator authenticates once per run against `/_vercel/password`, caches the returned
`_vercel_jwt` cookie, and attaches it to every subsequent request. Everything else has
sensible defaults — see `.env.example`.

---

## Usage

### Run the test suites (Playwright)

```bash
# Everything
npm test

# CSV URL batch only
npm run test:urls

# Header link health check only
npm run test:header

# View the HTML report after a run
npx playwright show-report reports/playwright-html
```

### Standalone CLI (for large release batches)

```bash
# Validate all URLs in the CSV
npm run validate

# Validate a specific release batch (e.g. release 1 of 4)
RELEASE_NUMBER=1 npm run validate

# Faster run with higher concurrency
CONCURRENCY=40 RELEASE_NUMBER=2 npm run validate
```

---

## The URL list

URLs live in `Resources/urls.csv` (gitignored). The file needs a single `url` column header:

```csv
url
https://sufi-app.vercel.app
https://sufi-app.vercel.app/seguros
```

Add one URL per line as pages get built, then re-run the suite.

---

## Environment variables reference

| Variable | Default | Description |
|---|---|---|
| `VERCEL_BYPASS_TOKEN` | — | Vercel visitor password for the protected preview deployments |
| `CSV_PATH` | `./Resources/urls.csv` | Path to the URL CSV (must have a `url` column) |
| `CONCURRENCY` | `20` | Parallel in-flight HTTP requests (1–100) |
| `MAX_RETRIES` | `3` | Retry attempts on network errors / HTTP 429 / 5xx |
| `RETRY_DELAY_MS` | `1000` | Base delay (ms) for exponential backoff |
| `RELEASE_NUMBER` | _(all)_ | Which release batch to validate (1-based) |
| `TOTAL_RELEASES` | `4` | Total number of release batches (for slicing) |
| `REPORT_DIR` | `./reports` | Output directory for reports |
| `REPORT_FORMAT` | `both` | `json`, `csv`, or `both` |
| `SLACK_ENABLED` | _(off)_ | Set to `true` to post a summary to Slack after the run |
| `SLACK_WEBHOOK_URL` | — | Slack Incoming Webhook URL (required if Slack is enabled) |

---

## Reports

After each run, reports are written to `./reports/`:

```
reports/
  validation-all-<timestamp>.json   ← Full result array + summary
  validation-all-<timestamp>.csv    ← Spreadsheet-friendly
  playwright-html/                  ← Playwright HTML report
```

CSV columns: `url`, `status`, `httpStatus`, `finalUrl`, `redirected`, `error`,
`durationMs`, `retryCount`, `timestamp`.

### Exit codes (CLI)

| Code | Meaning |
|---|---|
| `0` | All URLs passed |
| `1` | One or more URLs failed — check the report |

---

## Retry behaviour

The validator retries with exponential backoff (1s, 2s, 4s, …) on:

- Network / runtime errors
- HTTP `429` (rate limited)
- HTTP `5xx` (server errors)

HTTP `404` is **terminal** — it is never retried and counts as a definitive failure.

---

## Project structure

```
SUFI-url-validator/
├── src/
│   ├── globalSetup.ts          # Validates env config + clears results buffer
│   ├── globalTeardown.ts       # Sends the Slack summary (if enabled)
│   ├── validator.ts            # Standalone CLI entry point
│   ├── types/
│   │   └── index.ts            # Shared types
│   └── utils/
│       ├── assetValidator.ts   # Core validation + retry + p-limit + Vercel auth
│       ├── config.ts           # Environment loading + validation
│       ├── csvReader.ts        # CSV streaming reader + release-batch slicer
│       ├── reporter.ts         # Console output + JSON/CSV report writers
│       └── slackReporter.ts    # Slack Block Kit summary sender
├── tests/
│   ├── assets.spec.ts          # CSV URL batch — HTTP 200 validation
│   ├── header-nav.spec.ts      # Preview header link health check
│   └── seed.spec.ts            # Playwright codegen seed
├── Resources/
│   └── urls.csv                # URL list (gitignored)
├── reports/                    # Generated reports + QA run logs
├── .env.example                # Configuration template
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

> **Note:** This repo serves a dual purpose — the validator tooling above, and storage of
> manual QA run logs under `reports/QA/`. Manual test cases are authored and tracked in Testmo.
