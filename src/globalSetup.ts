import * as fs from 'fs';
import * as path from 'path';
import { loadConfig } from './utils/config';

const RESULTS_BUFFER = path.resolve(__dirname, '../reports/.results-buffer.ndjson');

/**
 * Playwright global setup — runs once before the entire test suite.
 * Validates the environment configuration eagerly so the test run
 * fails immediately with a clear message if credentials are missing,
 * rather than after the first test attempt.
 *
 * Also clears the per-run NDJSON results buffer here — this is the only
 * safe place to clear it because globalSetup is guaranteed to run exactly
 * once, before any describe-block beforeAll hooks fire.
 */
async function globalSetup(): Promise<void> {
  console.log('\n[GlobalSetup] Validating environment configuration...');

  try {
    const config = loadConfig();
    console.log(`[GlobalSetup] CSV Path:     ${config.csvPath}`);
    console.log(`[GlobalSetup] Concurrency:  ${config.concurrency}`);
    console.log(`[GlobalSetup] Release:      ${config.releaseNumber ?? 'ALL'} of ${config.totalReleases}`);
    console.log('[GlobalSetup] Configuration valid.\n');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`\n[GlobalSetup] CONFIGURATION ERROR:\n  ${message}\n`);
    process.exit(1);
  }

  // Clear the results buffer so every run starts with a clean slate.
  // Done here (not in beforeAll) so it cannot be wiped mid-run if
  // Playwright re-invokes a describe-level beforeAll hook.
  fs.mkdirSync(path.dirname(RESULTS_BUFFER), { recursive: true });
  fs.writeFileSync(RESULTS_BUFFER, '', 'utf-8');
  console.log('[GlobalSetup] Results buffer cleared.\n');
}

export default globalSetup;
