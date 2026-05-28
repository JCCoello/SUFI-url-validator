/**
 * Playwright test suite for URL validation.
 *
 * Iterates the CSV of migrated URLs / external redirects and asserts
 * each returns HTTP 200 after following redirects.
 *
 * Run modes:
 *   npx playwright test                    # all URLs
 *   RELEASE_NUMBER=1 npx playwright test   # specific release batch
 */

import { test, expect } from '@playwright/test';
import { loadConfig } from '../src/utils/config';
import { readUrls, getReleaseBatch } from '../src/utils/csvReader';
import { runValidation } from '../src/utils/assetValidator';
import {
  printSummary,
  writeJsonReport,
  writeCsvReport,
} from '../src/utils/reporter';
import type { ValidationSummary } from '../src/types';

const config = loadConfig();

test.describe('URL Validation', () => {
  test('all URLs in the configured batch return HTTP 200', async () => {
    const allUrls = await readUrls(config.csvPath);

    let targetUrls: string[];

    if (config.releaseNumber !== null) {
      const batch = getReleaseBatch(allUrls, config.releaseNumber, config.totalReleases);
      console.log(
        `\nRelease ${config.releaseNumber}/${config.totalReleases} — ` +
        `validating ${batch.ids.length} of ${allUrls.length} URLs`
      );
      targetUrls = batch.ids;
    } else {
      console.log(`\nValidating all ${allUrls.length} URLs`);
      targetUrls = allUrls;
    }

    const startTime = new Date();

    const results = await runValidation(targetUrls, config, {
      onResult: (result, index, total) => {
        const tag = result.status === 'OK' ? 'PASS' : 'FAIL';
        const detail = result.error ?? (result.httpStatus !== null ? `HTTP ${result.httpStatus}` : '');
        console.log(
          `  [${String(index + 1).padStart(4)}/${total}] ${tag} ${result.url}` +
          (detail ? ` — ${detail}` : '')
        );
      },
    });

    const endTime = new Date();

    const passed = results.filter((r) => r.status === 'OK').length;
    const failed = results.filter((r) => r.status === 'FAIL').length;
    const skipped = results.filter((r) => r.status === 'SKIP').length;

    const summary: ValidationSummary = {
      releaseNumber: config.releaseNumber,
      totalIds: targetUrls.length,
      passed,
      failed,
      skipped,
      passRate: `${((passed / targetUrls.length) * 100).toFixed(2)}%`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      durationSeconds: Math.round((endTime.getTime() - startTime.getTime()) / 1000),
      failures: results.filter((r) => r.status === 'FAIL'),
    };

    printSummary(summary);

    if (config.reportFormat === 'json' || config.reportFormat === 'both') {
      const p = writeJsonReport(results, summary, config.reportDir);
      console.log(`JSON report: ${p}`);
    }
    if (config.reportFormat === 'csv' || config.reportFormat === 'both') {
      const p = writeCsvReport(results, summary, config.reportDir);
      console.log(`CSV report:  ${p}`);
    }

    if (failed > 0) {
      const failedList = summary.failures
        .map((f) => `  • ${f.url} — ${f.error ?? `HTTP ${f.httpStatus ?? 'n/a'}`}`)
        .join('\n');

      expect(
        failed,
        `\n${failed} URL(s) failed validation:\n${failedList}\n\nFull details in: ${config.reportDir}`
      ).toBe(0);
    }
  });
});
