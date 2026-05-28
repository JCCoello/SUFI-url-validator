import * as fs from 'fs';
import * as path from 'path';
import type { ValidationResult, ValidationSummary } from '../types';

// ============================================================
// Console output helpers
// ============================================================

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';

export function logResult(result: ValidationResult, index: number, total: number): void {
  const prefix = `[${String(index + 1).padStart(String(total).length, ' ')}/${total}]`;
  const statusText = result.httpStatus !== null ? `HTTP ${result.httpStatus}` : 'no response';

  if (result.status === 'OK') {
    const redirectTag = result.redirected ? `${DIM}(→ ${result.finalUrl})${RESET}` : '';
    console.log(
      `${GREEN}PASS${RESET} ${DIM}${prefix}${RESET} ${result.url}` +
      `  ${DIM}${statusText}${RESET}` +
      (redirectTag ? `  ${redirectTag}` : '') +
      `  ${DIM}${result.durationMs}ms${RESET}`
    );
  } else {
    const errMsg = result.error ?? statusText;
    console.log(
      `${RED}FAIL${RESET} ${DIM}${prefix}${RESET} ${result.url}` +
      `  ${RED}${errMsg}${RESET}` +
      `  ${DIM}${result.durationMs}ms${RESET}`
    );
  }
}

export function logProgress(current: number, total: number): void {
  const pct = Math.round((current / total) * 100);
  const bar = '='.repeat(Math.floor(pct / 5)).padEnd(20, '-');
  process.stdout.write(`\r${CYAN}Progress:${RESET} [${bar}] ${pct}% (${current}/${total})`);
  if (current === total) process.stdout.write('\n');
}

export function printSummary(summary: ValidationSummary): void {
  console.log('\n' + '='.repeat(60));
  console.log(`  VALIDATION SUMMARY`);
  console.log('='.repeat(60));
  console.log(`  Release:     ${summary.releaseNumber ?? 'ALL'}`);
  console.log(`  Total URLs:  ${summary.totalIds}`);
  console.log(`  ${GREEN}Passed:${RESET}      ${summary.passed}`);
  console.log(`  ${RED}Failed:${RESET}      ${summary.failed}`);
  console.log(`  ${YELLOW}Skipped:${RESET}     ${summary.skipped}`);
  console.log(`  Pass Rate:   ${summary.passRate}`);
  console.log(`  Duration:    ${summary.durationSeconds}s`);
  console.log('='.repeat(60));

  if (summary.failed > 0) {
    console.log(`\n  ${RED}FAILED URLS:${RESET}`);
    for (const f of summary.failures) {
      const detail = f.error ?? (f.httpStatus !== null ? `HTTP ${f.httpStatus}` : 'no response');
      console.log(`    - ${f.url}`);
      console.log(`      ${detail}`);
    }
  }
  console.log('');
}

// ============================================================
// File report writers
// ============================================================

/**
 * Writes a JSON report containing the full result array plus the summary.
 */
export function writeJsonReport(
  results: ValidationResult[],
  summary: ValidationSummary,
  reportDir: string
): string {
  fs.mkdirSync(reportDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const releaseTag = summary.releaseNumber ? `release${summary.releaseNumber}` : 'all';
  const filePath = path.join(reportDir, `validation-${releaseTag}-${timestamp}.json`);

  const report = { summary, results };
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf-8');
  return filePath;
}

/**
 * Writes a CSV report — one row per URL.
 * Columns: url, status, httpStatus, finalUrl, redirected, error, durationMs, retryCount, timestamp
 */
export function writeCsvReport(
  results: ValidationResult[],
  summary: ValidationSummary,
  reportDir: string
): string {
  fs.mkdirSync(reportDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const releaseTag = summary.releaseNumber ? `release${summary.releaseNumber}` : 'all';
  const filePath = path.join(reportDir, `validation-${releaseTag}-${timestamp}.csv`);

  const headers = [
    'url',
    'status',
    'httpStatus',
    'finalUrl',
    'redirected',
    'error',
    'durationMs',
    'retryCount',
    'timestamp',
  ];

  const escapeCell = (value: string | number | boolean | null | undefined): string => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = results.map((r) =>
    [
      r.url,
      r.status,
      r.httpStatus,
      r.finalUrl,
      r.redirected,
      r.error,
      r.durationMs,
      r.retryCount,
      r.timestamp,
    ]
      .map(escapeCell)
      .join(',')
  );

  const content = [headers.join(','), ...rows].join('\n');
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}
