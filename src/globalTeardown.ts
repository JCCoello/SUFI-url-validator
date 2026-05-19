/**
 * Playwright global teardown — runs once after the entire test suite completes.
 *
 * Responsibilities:
 *   1. Reads the slack-summary.json file written by the spec's afterAll.
 *   2. Sends the validation summary to Slack via Incoming Webhook.
 *
 * The summary is persisted to disk by the spec (not passed directly) because
 * globalTeardown runs in a separate Node.js context from the test workers
 * and cannot access in-memory state from the test suite.
 *
 * If SLACK_WEBHOOK_URL is not set, the teardown completes silently.
 * If the summary file does not exist (e.g., the spec was skipped or crashed
 * before report generation), a warning is logged and Slack is skipped.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { sendSlackReport } from './utils/slackReporter';
import type { ValidationSummary } from './types';

const SUMMARY_FILE = path.resolve(__dirname, '../reports/slack-summary.json');

async function globalTeardown(): Promise<void> {
  if (process.env.SLACK_ENABLED !== 'true') {
    console.log('\n[GlobalTeardown] SLACK_ENABLED is not "true" — skipping Slack notification.\n');
    return;
  }

  // Load .env so SLACK_WEBHOOK_URL is available (globalTeardown has a fresh env)
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }

  if (!process.env.SLACK_WEBHOOK_URL) {
    console.log('\n[GlobalTeardown] SLACK_WEBHOOK_URL not set — skipping Slack notification.\n');
    return;
  }

  if (!fs.existsSync(SUMMARY_FILE)) {
    console.warn(
      `\n[GlobalTeardown] Summary file not found at ${SUMMARY_FILE}.\n` +
      `  The spec may have been skipped or crashed before report generation.\n` +
      `  Skipping Slack notification.\n`
    );
    return;
  }

  let summary: ValidationSummary;
  try {
    const raw = fs.readFileSync(SUMMARY_FILE, 'utf-8');
    summary = JSON.parse(raw) as ValidationSummary;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\n[GlobalTeardown] Failed to parse ${SUMMARY_FILE}: ${msg}\n`);
    return;
  }

  const releaseName =
    summary.releaseNumber !== null ? `Release ${summary.releaseNumber}` : 'All Releases';

  try {
    await sendSlackReport(summary, releaseName);
  } catch (err) {
    // Teardown failures must not fail the test run — log and continue.
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\n[GlobalTeardown] Slack notification failed: ${msg}\n`);
  } finally {
    // Clean up the transient summary file after sending
    try {
      fs.unlinkSync(SUMMARY_FILE);
    } catch {
      // Non-critical — ignore cleanup failures
    }
  }
}

export default globalTeardown;
