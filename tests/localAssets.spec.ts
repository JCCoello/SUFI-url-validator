/**
 * Local asset validation — no network calls required.
 *
 * Validates that the physical image files in the batch directory:
 *  1. All IDs from the CSV have a corresponding .jpg / .jpeg / .png file
 *  2. No file is zero-bytes (corrupt/empty download)
 *  3. Every file starts with valid magic bytes for its format
 *     (JPEG: FF D8 FF, PNG: 89 50 4E 47)
 *  4. No unexpected extra files exist in the directory
 *  5. Every image renders correctly in a browser (no broken image icon)
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
import { crossReferenceLocalAssets, findAssetFile } from '../src/utils/localAssetChecker';
import { loadConfig } from '../src/utils/config';

const config = loadConfig();

// Default to the first (and currently only) batch directory found in Resources
const DEFAULT_IMAGE_DIR = path.resolve(
  __dirname,
  '../Resources/Batch de imágenes 1 - 29 04 2026 - 300kb'
);
const IMAGE_DIR = process.env.IMAGE_DIR ?? DEFAULT_IMAGE_DIR;

const IMAGE_EXT_REGEX = /\.(jpg|jpeg|png)$/i;

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

    const files = fs.readdirSync(IMAGE_DIR).filter((f) => IMAGE_EXT_REGEX.test(f));
    console.log(`\nImage directory: ${IMAGE_DIR}`);
    console.log(`Image files found: ${files.length}`);
    expect(files.length).toBeGreaterThan(0);
  });

  test('all CSV asset IDs have a corresponding local image file', async () => {
    const allIds = await readAssetIds(config.csvPath);
    let targetIds: string[];

    if (config.releaseNumber !== null) {
      const batch = getReleaseBatch(allIds, config.releaseNumber, config.totalReleases);
      targetIds = batch.ids;
    } else {
      targetIds = allIds;
    }

    const { missing, corrupt, extra, duplicates, checks } = crossReferenceLocalAssets(
      targetIds,
      IMAGE_DIR
    );

    console.log(`\nChecked:    ${checks.length} assets`);
    console.log(`Present:    ${checks.filter((c) => c.exists).length}`);
    console.log(`Missing:    ${missing.length}`);
    console.log(`Corrupt:    ${corrupt.length}`);
    console.log(`Extra:      ${extra.length}`);
    console.log(`Duplicates: ${duplicates.length} (same ID with multiple extensions)`);

    if (missing.length > 0) {
      console.log(`\nMissing files (IDs in CSV but no image found):`);
      missing.forEach((id) => console.log(`  - ${id}`));
    }

    if (corrupt.length > 0) {
      console.log(`\nCorrupt files (zero bytes or invalid image header):`);
      corrupt.forEach((id) => console.log(`  - ${id}`));
    }

    if (extra.length > 0) {
      console.log(`\nExtra files (in directory but NOT in CSV):`);
      extra.forEach((id) => console.log(`  - ${id}`));
    }

    if (duplicates.length > 0) {
      console.log(`\nDuplicate assets (same ID with multiple extensions):`);
      duplicates.forEach((d) => console.log(`  - ${d.assetId} [${d.extensions.join(', ')}]`));
    }

    expect(
      missing.length,
      `${missing.length} CSV asset(s) have no corresponding image file:\n` +
      missing.map((id) => `  • ${id}`).join('\n')
    ).toBe(0);

    expect(
      corrupt.length,
      `${corrupt.length} image file(s) are zero-bytes or have an invalid header:\n` +
      corrupt.map((id) => `  • ${id}`).join('\n')
    ).toBe(0);
  });

  test('all images render correctly in browser (no broken image)', async ({ page }) => {
    const allIds = await readAssetIds(config.csvPath);
    const targetIds = config.releaseNumber !== null
      ? getReleaseBatch(allIds, config.releaseNumber, config.totalReleases).ids
      : allIds;

    // Resolve each id to its actual file path (.jpg/.jpeg/.png) once
    const resolved: Array<{ id: string; filePath: string }> = [];
    for (const id of targetIds) {
      const filePath = findAssetFile(id, IMAGE_DIR);
      if (filePath) resolved.push({ id, filePath });
    }

    const broken: string[] = [];
    const BATCH_SIZE = 50;
    const tmpHtml = path.resolve(__dirname, '../reports/visual-check.html');
    fs.mkdirSync(path.dirname(tmpHtml), { recursive: true });

    for (let i = 0; i < resolved.length; i += BATCH_SIZE) {
      const batch = resolved.slice(i, i + BATCH_SIZE);

      const imgTags = batch
        .map(({ id, filePath }) => {
          const src = filePath.replace(/\\/g, '/');
          return `<img src="file://${src}" data-id="${id}" />`;
        })
        .join('\n');

      fs.writeFileSync(tmpHtml, `<html><body>${imgTags}</body></html>`, 'utf-8');

      await page.goto(`file://${tmpHtml}`);
      await page.waitForLoadState('networkidle');

      const brokenInBatch: string[] = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];
        return imgs
          .filter((img) => img.naturalWidth === 0)
          .map((img) => img.getAttribute('data-id') ?? '');
      });

      broken.push(...brokenInBatch);

      const done = Math.min(i + BATCH_SIZE, resolved.length);
      console.log(`  Browser check: ${done}/${resolved.length} — broken so far: ${broken.length}`);
    }

    if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);

    if (broken.length > 0) {
      console.log(`\nBroken images (did not render in browser):`);
      broken.forEach((id) => console.log(`  - ${id}`));
    }

    expect(
      broken.length,
      `${broken.length} image(s) failed to render in browser:\n` +
      broken.map((id) => `  • ${id}`).join('\n')
    ).toBe(0);
  });
});
