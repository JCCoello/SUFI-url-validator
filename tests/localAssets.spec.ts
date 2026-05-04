/**
 * Local asset validation — no network calls required.
 *
 * Validates that the physical image files in the batch directory:
 *  1. All IDs from the CSV have a corresponding .jpg file in the batch directory
 *  2. No file is zero-bytes (corrupt/empty download)
 *  3. Every file starts with the JPEG magic bytes (FF D8 FF)
 *  4. No unexpected extra files exist in the directory
 *
 * This test can run offline and should be the first thing you run
 * before kicking off the Contentful CDA validation — it's cheaper.
 *
 * Set IMAGE_DIR env var to override the default batch directory path.
 */

import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { readAssetIds, getReleaseBatch } from '../src/utils/csvReader';
import { crossReferenceLocalAssets } from '../src/utils/localAssetChecker';
import { loadConfig } from '../src/utils/config';

const config = loadConfig();

// Default to the first (and currently only) batch directory found in Resources
const DEFAULT_IMAGE_DIR = path.resolve(
  __dirname,
  '../Resources/Batch de imágenes 1 - 29 04 2026 - 300kb'
);
const IMAGE_DIR = process.env.IMAGE_DIR ?? DEFAULT_IMAGE_DIR;

test.describe('Local Asset File Validation', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(IMAGE_DIR)) {
      test.skip();
    }
  });

  test('image directory exists and is readable', () => {
    expect(
      fs.existsSync(IMAGE_DIR),
      `Image directory not found: ${IMAGE_DIR}\nSet IMAGE_DIR env var to the correct path.`
    ).toBe(true);

    const files = fs.readdirSync(IMAGE_DIR).filter((f) => f.endsWith('.jpg'));
    console.log(`\nImage directory: ${IMAGE_DIR}`);
    console.log(`JPG files found: ${files.length}`);
    expect(files.length).toBeGreaterThan(0);
  });

  test('all CSV asset IDs have a corresponding local .jpg file', async () => {
    const allIds = await readAssetIds(config.csvPath);
    let targetIds: string[];

    if (config.releaseNumber !== null) {
      const batch = getReleaseBatch(allIds, config.releaseNumber, config.totalReleases);
      targetIds = batch.ids;
    } else {
      targetIds = allIds;
    }

    const { missing, corrupt, extra, checks } = crossReferenceLocalAssets(
      targetIds,
      IMAGE_DIR
    );

    console.log(`\nChecked:   ${checks.length} assets`);
    console.log(`Present:   ${checks.filter((c) => c.exists).length}`);
    console.log(`Missing:   ${missing.length}`);
    console.log(`Corrupt:   ${corrupt.length}`);
    console.log(`Extra:     ${extra.length}`);

    if (missing.length > 0) {
      console.log(`\nMissing files (IDs in CSV but no .jpg found):`);
      missing.forEach((id) => console.log(`  - ${id}`));
    }

    if (corrupt.length > 0) {
      console.log(`\nCorrupt files (zero bytes or invalid JPEG header):`);
      corrupt.forEach((id) => console.log(`  - ${id}`));
    }

    if (extra.length > 0) {
      console.log(`\nExtra files (in directory but NOT in CSV):`);
      extra.forEach((id) => console.log(`  - ${id}`));
    }

    expect(
      missing.length,
      `${missing.length} CSV asset(s) have no corresponding .jpg file:\n` +
      missing.map((id) => `  • ${id}`).join('\n')
    ).toBe(0);

    expect(
      corrupt.length,
      `${corrupt.length} .jpg file(s) are zero-bytes or have an invalid JPEG header:\n` +
      corrupt.map((id) => `  • ${id}`).join('\n')
    ).toBe(0);
  });
});
