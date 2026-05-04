/**
 * Playwright test suite for Contentful asset validation.
 *
 * This test uses Playwright's APIRequestContext for HTTP requests —
 * no browser is launched. This keeps it fast and CI-friendly.
 *
 * Run modes:
 *   npx playwright test                    # all releases
 *   RELEASE_NUMBER=1 npx playwright test   # specific release
 *
 * The test structure is flat (one test per asset batch) rather than
 * one test per asset. This is intentional: 999 individual test cases
 * in the Playwright HTML report is noise. The detailed per-asset
 * breakdown lives in the CSV/JSON reports written to ./reports/.
 *
 * If you want per-asset test isolation in Playwright, see the
 * parametrised variant at the bottom of this file (commented out).
 */

import { test, expect } from '@playwright/test';
import { loadConfig } from '../src/utils/config';
import { readAssetIds, getReleaseBatch } from '../src/utils/csvReader';
import { runValidation } from '../src/utils/assetValidator';
import {
  printSummary,
  writeJsonReport,
  writeCsvReport,
} from '../src/utils/reporter';
import type { ValidationSummary } from '../src/types';

// Load config once — shared across all tests in this file
const config = loadConfig();

test.describe('Contentful Asset Validation', () => {
  test('all assets in the configured batch return HTTP 200', async () => {
    // ---- Setup: determine which IDs to validate ----
    const allIds = await readAssetIds(config.csvPath);

    let targetIds: string[];

    if (config.releaseNumber !== null) {
      const batch = getReleaseBatch(allIds, config.releaseNumber, config.totalReleases);
      console.log(
        `\nRelease ${config.releaseNumber}/${config.totalReleases} — ` +
        `validating ${batch.ids.length} of ${allIds.length} assets`
      );
      targetIds = batch.ids;
    } else {
      console.log(`\nValidating all ${allIds.length} assets`);
      targetIds = allIds;
    }

    // ---- Execute validation ----
    const startTime = new Date();

    const results = await runValidation(targetIds, config, {
      onResult: (result, index, total) => {
        const tag = result.status === 'OK' ? 'PASS' : 'FAIL';
        const detail = result.imageError ?? result.cdaError ?? '';
        console.log(
          `  [${String(index + 1).padStart(4)}/${total}] ${tag} ${result.assetId}` +
          (detail ? ` — ${detail}` : '')
        );
      },
    });

    const endTime = new Date();

    // ---- Build summary ----
    const passed = results.filter((r) => r.status === 'OK').length;
    const failed = results.filter((r) => r.status === 'FAIL').length;
    const skipped = results.filter((r) => r.status === 'SKIP').length;

    const summary: ValidationSummary = {
      releaseNumber: config.releaseNumber,
      totalIds: targetIds.length,
      passed,
      failed,
      skipped,
      passRate: `${((passed / targetIds.length) * 100).toFixed(2)}%`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      durationSeconds: Math.round((endTime.getTime() - startTime.getTime()) / 1000),
      failures: results.filter((r) => r.status === 'FAIL'),
    };

    printSummary(summary);

    // ---- Write reports ----
    if (config.reportFormat === 'json' || config.reportFormat === 'both') {
      const p = writeJsonReport(results, summary, config.reportDir);
      console.log(`JSON report: ${p}`);
    }
    if (config.reportFormat === 'csv' || config.reportFormat === 'both') {
      const p = writeCsvReport(results, summary, config.reportDir);
      console.log(`CSV report:  ${p}`);
    }

    // ---- Assert: zero failures ----
    // The failure message lists every broken asset ID so CI logs are actionable.
    if (failed > 0) {
      const failedList = summary.failures
        .map((f) => `  • ${f.assetId} — CDA: ${f.cdaError ?? 'OK'} | IMG: ${f.imageError ?? 'OK'}`)
        .join('\n');

      expect(
        failed,
        `\n${failed} asset(s) failed validation:\n${failedList}\n\nFull details in: ${config.reportDir}`
      ).toBe(0);
    }
  });
});

// ============================================================
// Optional: per-asset parametrised tests
// Uncomment this block if you want individual pass/fail per asset
// in the Playwright HTML report. WARNING: creates 999 test cases —
// use only for targeted debugging, not for routine CI runs.
// ============================================================

/*
import { test as pwTest, expect as pwExpect } from '@playwright/test';

const allIds = fs.readFileSync(config.csvPath, 'utf-8')
  .split('\n')
  .slice(1)                        // skip header
  .map((l) => l.trim())
  .filter(Boolean);

for (const assetId of allIds) {
  pwTest(`asset ${assetId} returns HTTP 200`, async () => {
    const client = new ContentfulClient({ ... });
    const asset = await client.fetchAsset(assetId);
    const url = client.extractImageUrl(asset);
    pwExpect(url).toBeTruthy();
    const resp = await fetch(url!, { method: 'HEAD' });
    pwExpect(resp.status).toBe(200);
  });
}
*/
