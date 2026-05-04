# Contentful Asset Validator

Automated validator for Contentful image assets. Validates that every asset ID in a CSV
responds with HTTP 200 from both the Contentful CDA and the image CDN.

## Two validation layers

| Layer | What it checks | Requires network? |
|---|---|---|
| **Local** (`localAssets.spec.ts`) | File exists, non-zero bytes, valid JPEG header | No |
| **Remote** (`assets.spec.ts` / `validator.ts`) | CDA returns asset metadata, image CDN returns 200 | Yes |

Always run the local check first — it's free and catches corrupt downloads instantly.

---

## Setup

### 1. Prerequisites

- Node.js 18+
- npm 9+

### 2. Install dependencies

```bash
npm install
npx playwright install --with-deps chromium
```

> The `--with-deps` flag installs OS-level dependencies needed on Linux/CI.
> On macOS you can omit `--with-deps`.

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
CONTENTFUL_SPACE_ID=catp2t59asao
CONTENTFUL_ACCESS_TOKEN=<your CDA token>
CONTENTFUL_ENVIRONMENT=master
```

Everything else has sensible defaults. See `.env.example` for all options.

---

## Usage

### Option A — Standalone CLI (recommended for Release validation)

```bash
# Validate all IDs in the CSV
npx ts-node src/validator.ts

# Validate a specific release batch (e.g., Release 1 of 4)
RELEASE_NUMBER=1 npx ts-node src/validator.ts

# Override concurrency for faster runs (if you have Team/Enterprise CDA quota)
CONCURRENCY=10 RELEASE_NUMBER=2 npx ts-node src/validator.ts
```

### Option B — Playwright test runner (generates HTML report)

```bash
# Local file check only (no Contentful credentials needed)
npx playwright test tests/localAssets.spec.ts

# Remote CDA + CDN validation, release 1
RELEASE_NUMBER=1 npx playwright test tests/assets.spec.ts

# Both suites
RELEASE_NUMBER=1 npx playwright test

# View the HTML report after the run
npx playwright show-report reports/playwright-html
```

### Overriding the local image directory

```bash
IMAGE_DIR="/path/to/your/batch/folder" npx playwright test tests/localAssets.spec.ts
```

---

## Environment variables reference

| Variable | Default | Description |
|---|---|---|
| `CONTENTFUL_SPACE_ID` | — | **Required.** Your Contentful space ID |
| `CONTENTFUL_ACCESS_TOKEN` | — | **Required.** CDA delivery token |
| `CONTENTFUL_ENVIRONMENT` | `master` | Contentful environment name |
| `CSV_PATH` | `./Resources/images.csv` | Path to the asset ID CSV |
| `CONCURRENCY` | `5` | Parallel CDA requests (keep ≤7 on free tier) |
| `MAX_RETRIES` | `3` | Retry attempts for network/429/5xx errors |
| `RETRY_DELAY_MS` | `1000` | Base delay for exponential backoff |
| `RELEASE_NUMBER` | _(all)_ | Which release batch to validate (1–4) |
| `TOTAL_RELEASES` | `4` | Total number of releases (for batch slicing) |
| `REPORT_DIR` | `./reports` | Output directory for reports |
| `REPORT_FORMAT` | `both` | `json`, `csv`, or `both` |
| `IMAGE_DIR` | _(auto-detect)_ | Override local image batch directory |

---

## Reports

Reports are written to `./reports/` after each run:

```
reports/
  validation-release1-2026-05-04T....json   ← Full result + summary
  validation-release1-2026-05-04T....csv    ← Spreadsheet-friendly
  playwright-html/                          ← Playwright HTML report
```

### CSV columns

`assetId`, `status`, `imageUrl`, `cdaStatus`, `imageStatus`, `cdaError`, `imageError`,
`fileName`, `contentType`, `fileSizeBytes`, `durationMs`, `retryCount`, `timestamp`

### Exit codes

| Code | Meaning |
|---|---|
| `0` | All assets passed |
| `1` | One or more assets failed — check the report |

---

## Project structure

```
assetValidator/
├── src/
│   ├── globalSetup.ts          # Playwright global setup — validates env config
│   ├── validator.ts            # CLI entry point
│   └── utils/
│       ├── assetValidator.ts   # Core validation logic + retry + p-limit concurrency
│       ├── config.ts           # Environment variable loading + validation
│       ├── contentfulClient.ts # Thin CDA HTTP client (native fetch, no SDK)
│       ├── csvReader.ts        # CSV streaming reader + release batch slicer
│       ├── localAssetChecker.ts# Local JPEG file existence + header validation
│       └── reporter.ts         # Console output + JSON/CSV report writers
├── tests/
│   ├── assets.spec.ts          # Playwright test — CDA + CDN HTTP validation
│   └── localAssets.spec.ts     # Playwright test — local file validation
├── Resources/
│   └── images.csv              # Asset ID list (Release 1, 999 rows)
├── reports/                    # Generated reports (gitignored)
├── .env.example                # Configuration template
├── .gitignore
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

---

## Rate limiting

Contentful CDA limits:

| Tier | Requests/second |
|---|---|
| Free | ~7 req/s |
| Team | ~55 req/s |
| Enterprise | ~78 req/s |

The validator uses `p-limit` to cap concurrent in-flight requests. Set `CONCURRENCY=5`
for free tier (conservative), `CONCURRENCY=15` for Team tier.

For 999 assets at `CONCURRENCY=5`: expect ~5–8 minutes (each request takes ~300ms avg).
For 999 assets at `CONCURRENCY=15`: expect ~2–3 minutes.

---

## CI/CD (GitHub Actions)

The workflow at `.github/workflows/validate-assets.yml` supports:

- Manual trigger via `workflow_dispatch` with `release_number` input
- Automatic trigger on pushes to `validate/**` branches

Add these secrets to your GitHub repository:
- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ACCESS_TOKEN`
- `CONTENTFUL_ENVIRONMENT` (optional, defaults to `master`)
