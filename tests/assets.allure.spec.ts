/**
 * Contentful Asset Validation — Allure-instrumented variant.
 *
 * Generates ONE Allure test case per image for full per-asset traceability.
 *
 * Architecture:
 *   - Asset IDs are read synchronously at module load time (before any test runs).
 *   - A `for...of` loop registers one `test()` call per asset ID — each becomes
 *     an independent Allure test case with its own status, labels, and attachments.
 *   - The ContentfulClient is called directly (not via runValidation) so each test
 *     owns its own lifecycle with no shared mutable state.
 *   - A separate "batch summary" test runs after the asset loop to write the
 *     CSV/JSON reports and the slack-summary.json consumed by globalTeardown.
 *
 * Screenshot strategy:
 *   - A single Chromium browser context is shared across all tests within the
 *     describe block via beforeAll/afterAll — one browser launch for 999 tests,
 *     not 999 browser launches.
 *   - Each test reuses a shared `sharedPage` to navigate to the image URL and
 *     capture a screenshot, then attaches it to Allure.
 *   - If navigation fails (404, network error), the screenshot step is skipped
 *     gracefully — it does not change the test outcome.
 *   - `page.goto` with `waitUntil: 'load'` is sufficient for static image URLs;
 *     no additional wait is required.
 *
 * Allure hierarchy:
 *   Epic    → Banitsimo Migration
 *   Feature → Release 1 — Contentful Validation
 *   Story   → Asset HTTP Reachability
 *
 * Run:
 *   npm run test:contentful          # runs this suite
 *   npm run report                   # generates + opens Allure report
 *   npm run test:report              # both in sequence
 *
 * WARNING: Registering 999 individual test() calls is intentional here.
 * workers: 1 is enforced in playwright.config.ts, so there is no parallelism
 * overhead. The p-limit concurrency inside runValidation applies to batch mode
 * only (assets.spec.ts). Here each test validates exactly one asset.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as allure from 'allure-js-commons';
import { test, expect, chromium } from '@playwright/test';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { ContentfulClient, ContentfulApiError } from '../src/utils/contentfulClient';
import { loadConfig } from '../src/utils/config';
import { getReleaseBatch } from '../src/utils/csvReader';
import {
  printSummary,
  writeJsonReport,
  writeCsvReport,
} from '../src/utils/reporter';
import type { ValidationResult, ValidationSummary } from '../src/types';

// ---------------------------------------------------------------------------
// Config — loaded once at module parse time.
// ---------------------------------------------------------------------------
const config = loadConfig();

// ---------------------------------------------------------------------------
// Asset IDs — read synchronously so the for...of loop below can register
// one test() per ID before Playwright's test collection phase ends.
// ---------------------------------------------------------------------------
const CSV_CONTENT = fs.readFileSync(config.csvPath, 'utf-8');
const ALL_IDS = CSV_CONTENT
  .split('\n')
  .slice(1)                   // skip header row
  .map((l) => l.trim())
  .filter(Boolean)
  .map((l) => l.split(',')[0].trim()); // first column = ID

const TARGET_IDS: string[] = (() => {
  const selected = config.releaseNumber !== null
    ? getReleaseBatch(ALL_IDS, config.releaseNumber, config.totalReleases).ids
    : ALL_IDS;
  // Dedupe: Playwright requires unique test titles. Duplicate IDs in the CSV
  // (e.g. when a folder has the same ID with both .jpg and .png) would crash
  // the test collection phase with "duplicate test title".
  return Array.from(new Set(selected));
})();

// ---------------------------------------------------------------------------
// File-based results store — each test appends its result as a JSON line.
// Avoids the module-level array problem where Allure internals can prevent
// the push from reaching the summary test context.
// ---------------------------------------------------------------------------
const RESULTS_BUFFER = path.resolve(__dirname, '../reports/.results-buffer.ndjson');

function writeResult(result: ValidationResult): void {
  fs.mkdirSync(path.dirname(RESULTS_BUFFER), { recursive: true });
  fs.appendFileSync(RESULTS_BUFFER, JSON.stringify(result) + '\n', 'utf-8');
}

function readAllResults(): ValidationResult[] {
  if (!fs.existsSync(RESULTS_BUFFER)) return [];
  return fs.readFileSync(RESULTS_BUFFER, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as ValidationResult);
}

// Keep backward compat reference used in the summary test
const collectedResults: ValidationResult[] = [];

// ---------------------------------------------------------------------------
// Shared browser state — one browser context for all tests in this describe.
// Declared at module scope so beforeAll/afterAll can close them on teardown.
// ---------------------------------------------------------------------------
let browser: Browser;
let browserContext: BrowserContext;
let sharedPage: Page;

// ---------------------------------------------------------------------------
// Allure label helpers
// ---------------------------------------------------------------------------

async function applyAssetLabels(assetId: string): Promise<void> {
  await allure.epic('Banitsimo Migration');
  await allure.feature('Release 1 — Contentful Validation');
  await allure.story('Asset HTTP Reachability');
  await allure.severity('critical');
  await allure.tag('contentful');
  await allure.tag('release-1');
  await allure.parameter('assetId', assetId);
}

async function attachResultDetail(result: ValidationResult): Promise<void> {
  const payload = JSON.stringify(
    {
      assetId: result.assetId,
      status: result.status,
      cdaStatus: result.cdaStatus,
      imageUrl: result.imageUrl,
      imageStatus: result.imageStatus,
      fileName: result.fileName,
      contentType: result.contentType,
      fileSizeBytes: result.fileSizeBytes,
      durationMs: result.durationMs,
      retryCount: result.retryCount,
      timestamp: result.timestamp,
      cdaError: result.cdaError,
      imageError: result.imageError,
    },
    null,
    2
  );

  await allure.attachment('Validation Result', payload, {
    contentType: 'application/json',
    fileExtension: 'json',
  });

  if (result.imageUrl) {
    await allure.attachment('Image URL', result.imageUrl, {
      contentType: 'text/plain',
      fileExtension: 'txt',
    });
  }
}

/**
 * Navigates sharedPage to the image URL and attaches a screenshot to Allure.
 * Failures here are swallowed — a screenshot failure must never fail the test.
 */
async function captureAndAttachScreenshot(imageUrl: string, assetId: string): Promise<void> {
  try {
    // Navigate to the image URL. 'load' fires once the resource is fetched.
    // domcontentloaded is not meaningful for raw image responses, but 'load' is.
    const response = await sharedPage.goto(imageUrl, {
      waitUntil: 'load',
      timeout: 15_000,
    });

    if (!response || !response.ok()) {
      // Non-2xx: still take a screenshot to capture the browser error page.
      const screenshot = await sharedPage.screenshot({ type: 'jpeg', quality: 40, fullPage: false });
      await allure.attachment(`Screenshot (HTTP ${response?.status() ?? 'N/A'})`, screenshot, {
        contentType: 'image/jpeg',
        fileExtension: 'jpg',
      });
      return;
    }

    const screenshot = await sharedPage.screenshot({ type: 'jpeg', quality: 40, fullPage: false });
    await allure.attachment('Screenshot', screenshot, {
      contentType: 'image/jpeg',
      fileExtension: 'jpg',
    });
  } catch (err) {
    // Navigation timeout, DNS failure, etc. — log but do not rethrow.
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`  [screenshot] skipped for ${assetId}: ${msg}`);
  }
}

// ---------------------------------------------------------------------------
// Per-asset test loop
// ---------------------------------------------------------------------------

test.describe('Release 1 — Contentful Validation', () => {
  // ------------------------------------------------------------------
  // Launch one shared browser for all tests in this describe block.
  // Reusing a single page avoids the overhead of 999 browser launches
  // while keeping screenshots fully isolated per-navigation.
  // ------------------------------------------------------------------
  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    browserContext = await browser.newContext({
      // Viewport wide enough to render full-width images
      viewport: { width: 1280, height: 720 },
      // Ignore HTTPS certificate errors (some CDN configs may have issues)
      ignoreHTTPSErrors: true,
    });
    sharedPage = await browserContext.newPage();

    // Suppress noisy console output from the browser tab
    sharedPage.on('console', () => { /* intentionally silent */ });
  });

  test.afterAll(async () => {
    await sharedPage?.close().catch(() => { /* ignore */ });
    await browserContext?.close().catch(() => { /* ignore */ });
    await browser?.close().catch(() => { /* ignore */ });
  });

  // One test case per asset — this is the core of the Allure traceability.
  for (const assetId of TARGET_IDS) {
    test(assetId, async () => {
      // ---- Allure labels ----
      await applyAssetLabels(assetId);

      const client = new ContentfulClient({
        spaceId: config.spaceId,
        accessToken: config.accessToken,
        environment: config.environment,
        cdaBaseUrl: config.cdaBaseUrl,
      });

      const startTime = Date.now();

      const result: ValidationResult = {
        assetId,
        status: 'FAIL',
        cdaStatus: null,
        cdaError: null,
        imageUrl: null,
        imageStatus: null,
        imageError: null,
        fileName: null,
        contentType: null,
        fileSizeBytes: null,
        durationMs: 0,
        timestamp: new Date().toISOString(),
        retryCount: 0,
      };

      // ---- Phase 1: CDA fetch ----
      let asset: Awaited<ReturnType<typeof client.fetchAsset>> | undefined;
      await allure.step('Fetch asset metadata from Contentful CDA', async () => {
        try {
          asset = await client.fetchAsset(assetId);
          result.cdaStatus = 200;

          const rawFile = asset.fields.file as unknown as Record<string, unknown>;
          // Flat structure: { url, details, fileName, contentType }
          // Locale-keyed: { 'es': { url, details, fileName, contentType } }
          const fileData = typeof rawFile?.['url'] === 'string'
            ? rawFile
            : (Object.values(rawFile ?? {}).find((v) => typeof (v as Record<string, unknown>)?.['url'] === 'string') as Record<string, unknown> | undefined);
          if (fileData) {
            result.fileName = (fileData['fileName'] as string) ?? null;
            result.contentType = (fileData['contentType'] as string) ?? null;
            result.fileSizeBytes = ((fileData['details'] as Record<string, unknown>)?.['size'] as number) ?? null;
          }
        } catch (err) {
          result.cdaStatus = err instanceof ContentfulApiError ? err.httpStatus : null;
          result.cdaError =
            err instanceof Error ? err.message : `Unexpected error: ${String(err)}`;
        }
      });

      // Wrap everything from Phase 2 onwards so collectedResults.push is guaranteed
      try {
        if (result.cdaError) {
          // Phase 1 failed — skip Phase 2 and 3
        } else {
          // ---- Phase 2: Image URL reachability ----
          await allure.step('Validate image CDN URL (HEAD request)', async () => {
            if (!asset) return;

            const imageUrl = client.extractImageUrl(asset);
            if (!imageUrl) {
              result.cdaError = 'Asset exists in CDA but has no file URL (not yet migrated or not an image)';
              return;
            }

            result.imageUrl = imageUrl;

            try {
              const response = await fetch(imageUrl, {
                method: 'HEAD',
                headers: { 'User-Agent': 'contentful-asset-validator/1.0' },
              });

              result.imageStatus = response.status;

              if (response.ok) {
                result.status = 'OK';
              } else {
                result.imageError = `Image CDN returned HTTP ${response.status}`;
              }
            } catch (err) {
              result.imageError =
                err instanceof Error ? err.message : `Unexpected error: ${String(err)}`;
            }
          });

          // ---- Phase 3: Screenshot (evidence capture) ----
          if (result.imageUrl) {
            await allure.step('Capture screenshot of rendered image', async () => {
              await captureAndAttachScreenshot(result.imageUrl!, assetId);
            });
          }
        }

        result.durationMs = Date.now() - startTime;

        await allure.parameter('cdaStatus', String(result.cdaStatus ?? 'N/A'));
        await allure.parameter('imageStatus', String(result.imageStatus ?? 'N/A'));
        await allure.parameter('durationMs', String(result.durationMs));
        if (result.retryCount > 0) {
          await allure.parameter('retryCount', String(result.retryCount));
        }
        await attachResultDetail(result);
      } finally {
        writeResult(result);
      }

      // ---- Assert ----
      const errorDetail = [
        result.cdaError ? `CDA Error: ${result.cdaError}` : null,
        result.imageError ? `Image Error: ${result.imageError}` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      expect(
        result.status,
        errorDetail || `Asset ${assetId} failed — see attachment`
      ).toBe('OK');
    });
  }
});

// ---------------------------------------------------------------------------
// Summary test — writes CSV/JSON reports and the slack-summary.json after
// all asset tests have run. Runs last because test.describe ordering is
// sequential with workers: 1.
// ---------------------------------------------------------------------------

test.describe('Release 1 — Report Generation', () => {
  test('write CSV and JSON reports', async () => {
    await allure.epic('Banitsimo Migration');
    await allure.feature('Release 1 — Contentful Validation');
    await allure.story('Report Generation');
    await allure.severity('normal');
    await allure.tag('reporting');

    // Read all results written to disk by individual asset tests
    const allResults = readAllResults();

    if (allResults.length === 0) {
      console.log('No results collected — skipping report generation.');
      return;
    }

    // Safety net: any ID not written to disk gets a FAIL entry
    const writtenIds = new Set(allResults.map((r) => r.assetId));
    for (const assetId of TARGET_IDS) {
      if (!writtenIds.has(assetId)) {
        allResults.push({
          assetId,
          status: 'FAIL',
          cdaStatus: null,
          cdaError: 'Test did not complete — result not captured',
          imageUrl: null,
          imageStatus: null,
          imageError: null,
          fileName: null,
          contentType: null,
          fileSizeBytes: null,
          durationMs: 0,
          timestamp: new Date().toISOString(),
          retryCount: 0,
        });
      }
    }

    // Sync back to collectedResults for backward compat (Allure attachment)
    collectedResults.length = 0;
    collectedResults.push(...allResults);

    const passed = collectedResults.filter((r) => r.status === 'OK').length;
    const failed = collectedResults.filter((r) => r.status === 'FAIL').length;
    const skipped = collectedResults.filter((r) => r.status === 'SKIP').length;
    const total = TARGET_IDS.length;

    const summary: ValidationSummary = {
      releaseNumber: config.releaseNumber,
      totalIds: total,
      passed,
      failed,
      skipped,
      passRate: `${((passed / total) * 100).toFixed(2)}%`,
      startTime: collectedResults[0]?.timestamp ?? new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: Math.round(
        collectedResults.reduce((acc, r) => acc + r.durationMs, 0) / 1000
      ),
      failures: collectedResults.filter((r) => r.status === 'FAIL'),
    };

    printSummary(summary);

    if (config.reportFormat === 'json' || config.reportFormat === 'both') {
      const p = writeJsonReport(collectedResults, summary, config.reportDir);
      console.log(`JSON report: ${p}`);
    }
    if (config.reportFormat === 'csv' || config.reportFormat === 'both') {
      const p = writeCsvReport(collectedResults, summary, config.reportDir);
      console.log(`CSV report:  ${p}`);
    }

    await allure.attachment(
      'Batch Summary',
      JSON.stringify(summary, null, 2),
      { contentType: 'application/json', fileExtension: 'json' }
    );

    // Write slack-summary.json only when Slack notifications are explicitly enabled
    if (process.env.SLACK_ENABLED === 'true') {
      const reportDir = process.env.REPORT_DIR
        ? path.resolve(process.cwd(), process.env.REPORT_DIR)
        : path.resolve(process.cwd(), 'reports');
      fs.mkdirSync(reportDir, { recursive: true });
      fs.writeFileSync(
        path.resolve(reportDir, 'slack-summary.json'),
        JSON.stringify(summary, null, 2),
        'utf-8'
      );
    }

    await allure.parameter('passed', String(passed));
    await allure.parameter('failed', String(failed));
    await allure.parameter('passRate', summary.passRate);
  });
});
