/**
 * Standalone CLI entry point.
 * Run with:  npx ts-node src/validator.ts
 *
 * Iterates a CSV of URLs and verifies each returns HTTP 200
 * (redirects followed; 404 is terminal).
 */

import { loadConfig } from './utils/config';
import { readUrls, getReleaseBatch } from './utils/csvReader';
import { runValidation } from './utils/assetValidator';
import {
  logResult,
  printSummary,
  writeJsonReport,
  writeCsvReport,
} from './utils/reporter';
import type { ValidationSummary } from './types';

async function main(): Promise<void> {
  console.log('================================================');
  console.log('  URL Validator');
  console.log('================================================\n');

  const config = loadConfig();

  console.log(`Reading URLs from: ${config.csvPath}`);
  const allUrls = await readUrls(config.csvPath);
  console.log(`Total URLs in CSV: ${allUrls.length}`);

  let targetUrls: string[];
  let releaseInfo: string;

  if (config.releaseNumber !== null) {
    const batch = getReleaseBatch(allUrls, config.releaseNumber, config.totalReleases);
    targetUrls = batch.ids;
    releaseInfo =
      `Release ${config.releaseNumber}/${config.totalReleases}` +
      ` — URLs ${batch.startIndex + 1} to ${batch.endIndex}` +
      ` (${batch.ids.length} URLs)`;
  } else {
    targetUrls = allUrls;
    releaseInfo = `ALL releases (${allUrls.length} URLs)`;
  }

  console.log(`Target batch:     ${releaseInfo}`);
  console.log(`Concurrency:      ${config.concurrency} parallel requests`);
  console.log(`Max retries:      ${config.maxRetries}\n`);

  const startTime = new Date();
  console.log(`Started:          ${startTime.toISOString()}\n`);

  const results = await runValidation(targetUrls, config, {
    onResult: (result, index, total) => logResult(result, index, total),
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
    const jsonPath = writeJsonReport(results, summary, config.reportDir);
    console.log(`JSON report:      ${jsonPath}`);
  }

  if (config.reportFormat === 'csv' || config.reportFormat === 'both') {
    const csvPath = writeCsvReport(results, summary, config.reportDir);
    console.log(`CSV report:       ${csvPath}`);
  }

  console.log('');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\nFATAL ERROR:', err instanceof Error ? err.message : err);
  process.exit(1);
});
