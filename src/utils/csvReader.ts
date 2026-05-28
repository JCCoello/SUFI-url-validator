import * as fs from 'fs';
import * as readline from 'readline';
import type { ReleaseBatch } from '../types';

/**
 * Reads URLs from a CSV file with a "url" column header.
 * Uses streaming readline to avoid loading the full CSV into memory —
 * safe for files with thousands of rows.
 *
 * @returns Ordered array of URL strings (header excluded)
 */
export async function readUrls(csvPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const urls: string[] = [];
    let isFirstLine = true;
    let headerColumnIndex = 0;

    const fileStream = fs.createReadStream(csvPath, { encoding: 'utf-8' });
    fileStream.on('error', (err) => reject(new Error(`Cannot read CSV at ${csvPath}: ${err.message}`)));

    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    rl.on('line', (line) => {
      const trimmed = line.trim();
      if (!trimmed) return; // skip blank lines

      if (isFirstLine) {
        // Parse header to find the "url" column index (case-insensitive)
        const headers = trimmed.split(',').map((h) => h.trim().toLowerCase());
        headerColumnIndex = headers.indexOf('url');
        if (headerColumnIndex === -1) {
          rl.close();
          reject(new Error(`CSV header must contain a "url" column. Found columns: ${headers.join(', ')}`));
          return;
        }
        isFirstLine = false;
        return;
      }

      const columns = trimmed.split(',');
      const url = columns[headerColumnIndex]?.trim();
      if (url && url.length > 0) {
        urls.push(url);
      }
    });

    rl.on('close', () => resolve(urls));
    rl.on('error', (err) => reject(err));
  });
}

/**
 * Slices the full list into a specific release batch.
 * Batches are equal-sized slices; the last batch absorbs any remainder.
 *
 * Example: 999 items, 4 releases -> batches of ~250 each.
 *
 * @param allIds     Full ordered list of strings
 * @param release    1-based release number (1 to totalReleases)
 * @param total      Total number of releases
 */
export function getReleaseBatch(allIds: string[], release: number, total: number): ReleaseBatch {
  const batchSize = Math.ceil(allIds.length / total);
  const startIndex = (release - 1) * batchSize;
  const endIndex = Math.min(startIndex + batchSize, allIds.length);
  const ids = allIds.slice(startIndex, endIndex);

  return {
    releaseNumber: release,
    totalReleases: total,
    startIndex,
    endIndex,
    ids,
    totalIds: allIds.length,
  };
}
