import { loadConfig } from './utils/config';

/**
 * Playwright global setup — runs once before the entire test suite.
 * Validates the environment configuration eagerly so the test run
 * fails immediately with a clear message if credentials are missing,
 * rather than after the first test attempt.
 */
async function globalSetup(): Promise<void> {
  console.log('\n[GlobalSetup] Validating environment configuration...');

  try {
    const config = loadConfig();
    console.log(`[GlobalSetup] Space ID:     ${config.spaceId}`);
    console.log(`[GlobalSetup] Environment:  ${config.environment}`);
    console.log(`[GlobalSetup] CSV Path:     ${config.csvPath}`);
    console.log(`[GlobalSetup] Concurrency:  ${config.concurrency}`);
    console.log(`[GlobalSetup] Release:      ${config.releaseNumber ?? 'ALL'} of ${config.totalReleases}`);
    console.log('[GlobalSetup] Configuration valid.\n');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`\n[GlobalSetup] CONFIGURATION ERROR:\n  ${message}\n`);
    process.exit(1);
  }
}

export default globalSetup;
