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

  if (result.status === 'OK') {
    console.log(
      `${GREEN}PASS${RESET} ${DIM}${prefix}${RESET} ${result.assetId}` +
      `  ${DIM}${result.imageUrl ?? ''}${RESET}` +
      `  ${DIM}${result.durationMs}ms${RESET}`
    );
  } else {
    const cdaErr = result.cdaError ? `CDA: ${result.cdaError}` : '';
    const imgErr = result.imageError ? `IMG: ${result.imageError}` : '';
    const errors = [cdaErr, imgErr].filter(Boolean).join(' | ');
    console.log(
      `${RED}FAIL${RESET} ${DIM}${prefix}${RESET} ${result.assetId}` +
      `  ${RED}${errors}${RESET}` +
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
  console.log(`  Total IDs:   ${summary.totalIds}`);
  console.log(`  ${GREEN}Passed:${RESET}      ${summary.passed}`);
  console.log(`  ${RED}Failed:${RESET}      ${summary.failed}`);
  console.log(`  ${YELLOW}Skipped:${RESET}     ${summary.skipped}`);
  console.log(`  Pass Rate:   ${summary.passRate}`);
  console.log(`  Duration:    ${summary.durationSeconds}s`);
  console.log('='.repeat(60));

  if (summary.failed > 0) {
    console.log(`\n  ${RED}FAILED ASSETS:${RESET}`);
    for (const f of summary.failures) {
      console.log(`    - ${f.assetId}`);
      if (f.cdaError)   console.log(`      CDA:   ${f.cdaError}`);
      if (f.imageError) console.log(`      IMAGE: ${f.imageError}`);
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
 * Writes a CSV report — one row per asset ID.
 * Columns: assetId, status, imageUrl, cdaStatus, imageStatus, cdaError, imageError,
 *          fileName, contentType, fileSizeBytes, durationMs, retryCount, timestamp
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
    'assetId',
    'status',
    'imageUrl',
    'cdaStatus',
    'imageStatus',
    'cdaError',
    'imageError',
    'fileName',
    'contentType',
    'fileSizeBytes',
    'durationMs',
    'retryCount',
    'timestamp',
  ];

  const escapeCell = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    // Wrap in quotes if the value contains commas, quotes, or newlines
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = results.map((r) =>
    [
      r.assetId,
      r.status,
      r.imageUrl,
      r.cdaStatus,
      r.imageStatus,
      r.cdaError,
      r.imageError,
      r.fileName,
      r.contentType,
      r.fileSizeBytes,
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
