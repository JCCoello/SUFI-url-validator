/**
 * Evidence capture — screenshots of every Contentful image URL.
 *
 * For each asset ID in the CSV:
 *  1. Calls Contentful CDA to resolve the image URL
 *  2. Navigates to the URL in a real browser (Chromium)
 *  3. Takes a screenshot saved to ./reports/screenshots/{assetId}.png
 *  4. Generates an HTML gallery at ./reports/evidence-gallery.html
 *
 * Run after the environment is ready:
 *   RELEASE_NUMBER= npx playwright test tests/evidence.spec.ts
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { loadConfig } from '../src/utils/config';
import { readAssetIds, getReleaseBatch } from '../src/utils/csvReader';
import { ContentfulClient } from '../src/utils/contentfulClient';

const config = loadConfig();
const SCREENSHOTS_DIR = path.resolve(config.reportDir, 'screenshots');

test.describe('Contentful Image Evidence', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
  });

  test('capture screenshot for every image URL in the environment', async ({ page }) => {
    const allIds = await readAssetIds(config.csvPath);
    const targetIds = config.releaseNumber !== null
      ? getReleaseBatch(allIds, config.releaseNumber, config.totalReleases).ids
      : allIds;

    const client = new ContentfulClient({
      spaceId: config.spaceId,
      accessToken: config.accessToken,
      environment: config.environment,
      cdaBaseUrl: config.cdaBaseUrl,
    });

    type EvidenceEntry = {
      assetId: string;
      imageUrl: string | null;
      screenshotPath: string | null;
      status: 'OK' | 'NO_URL' | 'ERROR';
      error: string | null;
    };

    const entries: EvidenceEntry[] = [];
    const CONCURRENCY = 5;

    // Process assets sequentially in groups to avoid overloading
    for (let i = 0; i < targetIds.length; i++) {
      const assetId = targetIds[i];
      const entry: EvidenceEntry = {
        assetId,
        imageUrl: null,
        screenshotPath: null,
        status: 'OK',
        error: null,
      };

      try {
        const asset = await client.fetchAsset(assetId);
        const imageUrl = client.extractImageUrl(asset);

        if (!imageUrl) {
          entry.status = 'NO_URL';
          entry.error = 'Asset has no image URL in CDA';
          entries.push(entry);
          console.log(`  [${i + 1}/${targetIds.length}] NO_URL  ${assetId}`);
          continue;
        }

        entry.imageUrl = imageUrl;

        await page.goto(imageUrl, { waitUntil: 'networkidle', timeout: 15000 });

        const screenshotPath = path.join(SCREENSHOTS_DIR, `${assetId}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        entry.screenshotPath = screenshotPath;

        console.log(`  [${i + 1}/${targetIds.length}] OK      ${assetId}`);
      } catch (err) {
        entry.status = 'ERROR';
        entry.error = err instanceof Error ? err.message : String(err);
        console.log(`  [${i + 1}/${targetIds.length}] ERROR   ${assetId} — ${entry.error}`);
      }

      entries.push(entry);

      // Brief pause every CONCURRENCY assets to avoid CDA rate limits
      if ((i + 1) % CONCURRENCY === 0) {
        await page.waitForTimeout(200);
      }
    }

    // Generate HTML gallery
    const galleryPath = path.join(config.reportDir, 'evidence-gallery.html');
    fs.writeFileSync(galleryPath, buildGalleryHtml(entries, config.spaceId), 'utf-8');
    console.log(`\nGallery report: ${galleryPath}`);
    console.log(`Screenshots:    ${SCREENSHOTS_DIR}`);

    const failed = entries.filter((e) => e.status !== 'OK');
    if (failed.length > 0) {
      console.log(`\nFailed (${failed.length}):`);
      failed.forEach((e) => console.log(`  • ${e.assetId} — ${e.error}`));
    }

    const noUrlCount = entries.filter((e) => e.status === 'NO_URL').length;
    const errorCount = entries.filter((e) => e.status === 'ERROR').length;

    expect(
      errorCount,
      `${errorCount} asset(s) errored during screenshot capture`
    ).toBe(0);

    expect(
      noUrlCount,
      `${noUrlCount} asset(s) exist in CDA but have no image URL (not yet migrated?)`
    ).toBe(0);
  });
});

function buildGalleryHtml(entries: Array<{
  assetId: string;
  imageUrl: string | null;
  screenshotPath: string | null;
  status: string;
  error: string | null;
}>, spaceId: string): string {
  const ok = entries.filter((e) => e.status === 'OK').length;
  const total = entries.length;
  const date = new Date().toISOString();

  const cards = entries.map((e) => {
    const screenshotSrc = e.screenshotPath
      ? `file://${e.screenshotPath}`
      : '';

    const badge = e.status === 'OK'
      ? `<span class="badge ok">OK</span>`
      : `<span class="badge fail">${e.status}</span>`;

    const img = screenshotSrc
      ? `<img src="${screenshotSrc}" alt="${e.assetId}" loading="lazy" />`
      : `<div class="no-img">${e.error ?? 'No image'}</div>`;

    return `
      <div class="card ${e.status !== 'OK' ? 'card-fail' : ''}">
        ${badge}
        ${img}
        <div class="card-body">
          <code>${e.assetId}</code>
          ${e.imageUrl ? `<a href="${e.imageUrl}" target="_blank">Open URL</a>` : ''}
          ${e.error ? `<p class="error">${e.error}</p>` : ''}
        </div>
      </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Evidence Gallery — Contentful Assets</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #f5f5f5; color: #333; padding: 24px; }
    header { margin-bottom: 24px; }
    h1 { font-size: 1.5rem; font-weight: 700; }
    .meta { font-size: 0.85rem; color: #666; margin-top: 4px; }
    .summary { display: flex; gap: 16px; margin-bottom: 24px; }
    .stat { background: #fff; border-radius: 8px; padding: 16px 24px; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
    .stat strong { display: block; font-size: 1.8rem; font-weight: 700; }
    .stat span { font-size: 0.8rem; color: #888; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .card { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.1); position: relative; }
    .card-fail { border: 2px solid #f44336; }
    .card img { width: 100%; height: 150px; object-fit: cover; display: block; }
    .no-img { width: 100%; height: 150px; display: flex; align-items: center; justify-content: center; background: #ffeaea; color: #c00; font-size: 0.8rem; padding: 8px; text-align: center; }
    .card-body { padding: 10px; font-size: 0.78rem; }
    .card-body code { display: block; word-break: break-all; margin-bottom: 4px; color: #555; }
    .card-body a { color: #1976d2; text-decoration: none; }
    .card-body a:hover { text-decoration: underline; }
    .error { color: #c00; margin-top: 4px; font-size: 0.75rem; }
    .badge { position: absolute; top: 8px; right: 8px; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
    .badge.ok { background: #e8f5e9; color: #2e7d32; }
    .badge.fail { background: #fdecea; color: #c62828; }
  </style>
</head>
<body>
  <header>
    <h1>Evidence Gallery — Contentful Asset Validation</h1>
    <p class="meta">Space: ${spaceId} &nbsp;|&nbsp; Generated: ${date}</p>
  </header>
  <div class="summary">
    <div class="stat"><strong>${total}</strong><span>Total</span></div>
    <div class="stat"><strong style="color:#2e7d32">${ok}</strong><span>OK</span></div>
    <div class="stat"><strong style="color:#c62828">${total - ok}</strong><span>Failed</span></div>
  </div>
  <div class="grid">
    ${cards}
  </div>
</body>
</html>`;
}
