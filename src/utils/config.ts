import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import type { ValidatorConfig } from '../types';

/**
 * Loads and validates configuration from environment variables.
 * Call this once at startup — do not call per-test.
 */
export function loadConfig(): ValidatorConfig {
  const envPath = path.resolve(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    dotenv.config();
  }

  const releaseRaw = process.env.RELEASE_NUMBER;
  const releaseNumber = releaseRaw ? parseInt(releaseRaw, 10) : null;
  const totalReleases = parseInt(process.env.TOTAL_RELEASES ?? '4', 10);

  if (releaseNumber !== null) {
    if (isNaN(releaseNumber) || releaseNumber < 1 || releaseNumber > totalReleases) {
      throw new Error(
        `RELEASE_NUMBER must be between 1 and ${totalReleases} (got: ${releaseRaw})`
      );
    }
  }

  const concurrency = parseInt(process.env.CONCURRENCY ?? '20', 10);
  if (concurrency < 1 || concurrency > 100) {
    throw new Error(`CONCURRENCY must be between 1 and 100 (got: ${concurrency})`);
  }

  const reportFormat = (process.env.REPORT_FORMAT ?? 'both') as ValidatorConfig['reportFormat'];
  if (!['json', 'csv', 'both'].includes(reportFormat)) {
    throw new Error(`REPORT_FORMAT must be one of: json, csv, both (got: ${reportFormat})`);
  }

  const csvPath = path.resolve(__dirname, '../../', process.env.CSV_PATH ?? './Resources/urls.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at: ${csvPath}`);
  }

  return {
    csvPath,
    concurrency,
    maxRetries: parseInt(process.env.MAX_RETRIES ?? '3', 10),
    retryDelayMs: parseInt(process.env.RETRY_DELAY_MS ?? '1000', 10),
    releaseNumber,
    totalReleases,
    reportDir: path.resolve(__dirname, '../../', process.env.REPORT_DIR ?? './reports'),
    reportFormat,
    vercelBypassToken: process.env.VERCEL_BYPASS_TOKEN ?? null,
  };
}
