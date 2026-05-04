/**
 * Standalone CLI entry point.
 * Run with:  npx ts-node src/validator.ts
 *
 * This can be run independently of Playwright (no browser needed).
 * All validation is done via HTTP requests to Contentful's CDA and CDN.
 */

import { loadConfig } from './utils/config';
import { readAssetIds, getReleaseBatch } from './utils/csvReader';
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
  console.log('  Contentful Asset Validator');
  console.log('================================================\n');

  // 1. Load and validate configuration
  const config = loadConfig();

  // 2. Read all asset IDs from CSV
  console.log(`Reading IDs from: ${config.csvPath}`);
  const allIds = await readAssetIds(config.csvPath);
  console.log(`Total IDs in CSV: ${allIds.length}`);

  // 3. Slice into the appropriate release batch (or use all)
  let targetIds: string[];
  let releaseInfo: string;

  if (config.releaseNumber !== null) {
    const batch = getReleaseBatch(allIds, config.releaseNumber, config.totalReleases);
    targetIds = batch.ids;
    releaseInfo =
      `Release ${config.releaseNumber}/${config.totalReleases}` +
      ` — IDs ${batch.startIndex + 1} to ${batch.endIndex}` +
      ` (${batch.ids.length} assets)`;
  } else {
    targetIds = allIds;
    releaseInfo = `ALL releases (${allIds.length} assets)`;
  }

  console.log(`Target batch:     ${releaseInfo}`);
  console.log(`Concurrency:      ${config.concurrency} parallel requests`);
  console.log(`Max retries:      ${config.maxRetries}\n`);

  // 4. Run validation
  const startTime = new Date();
  console.log(`Started:          ${startTime.toISOString()}\n`);

  const results = await runValidation(targetIds, config, {
    onResult: (result, index, total) => logResult(result, index, total),
    onProgress: (_current, _total) => {
      // Progress bar is handled per-result above; uncomment below for a
      // separate progress line if you prefer that style:
      // logProgress(current, total);
    },
  });

  const endTime = new Date();

  // 5. Build summary
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

  // 6. Print summary to console
  printSummary(summary);

  // 7. Write reports to disk
  const reportPaths: string[] = [];

  if (config.reportFormat === 'json' || config.reportFormat === 'both') {
    const jsonPath = writeJsonReport(results, summary, config.reportDir);
    reportPaths.push(jsonPath);
    console.log(`JSON report:      ${jsonPath}`);
  }

  if (config.reportFormat === 'csv' || config.reportFormat === 'both') {
    const csvPath = writeCsvReport(results, summary, config.reportDir);
    reportPaths.push(csvPath);
    console.log(`CSV report:       ${csvPath}`);
  }

  console.log('');

  // 8. Exit with non-zero code if any validations failed — important for CI
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\nFATAL ERROR:', err instanceof Error ? err.message : err);
  process.exit(1);
});
