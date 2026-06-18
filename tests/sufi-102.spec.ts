import { test, expect, type Page, type Locator } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const VERCEL_PW = process.env.VERCEL_PASSWORD ?? 'sufi-25-apply';
const CF_EMAIL = process.env.CONTENTFUL_EMAIL!;
const CF_PW = process.env.CONTENTFUL_PASSWORD!;

const STORYBOOK = 'https://sufi-acl.vercel.app';
const DEV = 'https://sufi-app-git-dev-apply-digital-sandbox.vercel.app';
const CF_SPACE = '1bla4bgmu67p';
const CF_ENV = 'development';
const CF_CARD_ENTRY = '6eCvaD7HZFKp7UVdcmVwCO';
const CF_PROMO_ENTRY = '2MtpgObygogVo3pVw1jblh';
const SCREENSHOTS_DIR = 'reports/QA/manual-runs/SUFI-102';

const COLORS = ['green', 'marine', 'orange', 'sky', 'violet', 'yellow'];
const SUB_TONES = COLORS.flatMap(c => [`${c}-medium`, `${c}-light`]);

// ── helpers ───────────────────────────────────────────────────────────────────

async function handleVercelWall(page: Page) {
  const pwInput = page.locator('input[type="password"]').first();
  if (await pwInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await pwInput.fill(VERCEL_PW);
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
  }
}

async function annotateAndScreenshot(page: Page, locator: Locator, screenshotPath: string, label: string) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (box) {
    const arrowAbove = box.y > 40;
    await page.evaluate(({ x, y, w, h, lbl, above }) => {
      document.getElementById('__qa-annotation')?.remove();
      const wrap = document.createElement('div');
      wrap.id = '__qa-annotation';
      wrap.style.cssText = `position:fixed;top:${y - 3}px;left:${x - 3}px;width:${w + 6}px;height:${h + 6}px;border:3px solid #D32F2F;box-sizing:border-box;pointer-events:none;z-index:99999;`;
      const tag = document.createElement('div');
      tag.style.cssText = `position:absolute;${above ? 'top:-26px' : 'bottom:-26px'};left:0;background:#D32F2F;color:#fff;font:bold 11px monospace;padding:2px 6px;border-radius:3px;white-space:nowrap;`;
      tag.textContent = (above ? '▼ ' : '▲ ') + lbl;
      wrap.appendChild(tag);
      document.body.appendChild(wrap);
    }, { x: box.x, y: box.y, w: box.width, h: box.height, lbl: label, above: arrowAbove });
  }
  await page.screenshot({ path: screenshotPath });
  await page.evaluate(() => document.getElementById('__qa-annotation')?.remove());
}

async function loginContentful(page: Page) {
  await page.goto('https://be.contentful.com/login');
  await page.waitForLoadState('domcontentloaded');
  await page.locator('[data-test-id="email-input"]').fill(CF_EMAIL);
  await page.locator('[data-test-id="password-input"]').fill(CF_PW);
  await page.locator('[data-test-id="login-button"]').click();
  // Contentful SPA does not reliably change the URL after login — wait for network idle instead
  await page.waitForLoadState('networkidle', { timeout: 30000 });
}

// ── AC1 ───────────────────────────────────────────────────────────────────────

test('[SUFI-102][AC1] Foundation Colors — medium y light documentados en Storybook', async ({ page }) => {
  await page.goto(`${STORYBOOK}/?path=/docs/foundations-colors--documentation`);
  await handleVercelWall(page);
  await page.waitForLoadState('networkidle');

  const sbFrame = page.frameLocator('#storybook-preview-iframe');
  for (const token of SUB_TONES) {
    await expect(sbFrame.locator(`text="${token}"`).first())
      .toBeVisible({ timeout: 8000 });
  }

  // Annotate the first green-medium token as the representative element
  await annotateAndScreenshot(
    page,
    sbFrame.locator('text="green-medium"').first(),
    `${SCREENSHOTS_DIR}/sufi102-AC1-foundation-colors.png`,
    'AC1 — green-medium',
  );
});

// ── AC2 ───────────────────────────────────────────────────────────────────────

test('[SUFI-102][AC2] Card Storybook — subtonalidades en control backgroundColor', async ({ page }) => {
  await page.goto(`${STORYBOOK}/?path=/story/molecules-card--default`);
  await handleVercelWall(page);
  await page.waitForLoadState('networkidle');

  // Controls panel renders as a <table>; backgroundColor row contains a native <select>
  const bgSelect = page.getByRole('row', { name: /backgroundColor/ }).getByRole('combobox');
  await bgSelect.waitFor({ timeout: 15000 });

  const options = await bgSelect.locator('option').allTextContents();
  for (const token of SUB_TONES) {
    expect(options.some(o => o.includes(token)), `Missing option: ${token}`).toBe(true);
  }

  // Scroll the exact backgroundColor row into view (other rows also contain the word)
  const bgRow = page.getByRole('row').filter({
    has: page.getByRole('cell', { name: 'backgroundColor', exact: true }),
  });
  await annotateAndScreenshot(page, bgRow, `${SCREENSHOTS_DIR}/sufi102-AC2-card-storybook-control.png`, 'AC2 — backgroundColor');
});

// ── AC3 ───────────────────────────────────────────────────────────────────────

test('[SUFI-102][AC3] Promotional Card Storybook — subtonalidades en control backgroundColor', async ({ page }) => {
  await page.goto(`${STORYBOOK}/?path=/story/organisms-promotional-card--horizontal-background-color`);
  await handleVercelWall(page);
  await page.waitForLoadState('networkidle');

  const bgSelect = page.getByRole('row', { name: /backgroundColor/ }).getByRole('combobox');
  await bgSelect.waitFor({ timeout: 15000 });

  const options = await bgSelect.locator('option').allTextContents();
  for (const token of SUB_TONES) {
    expect(options.some(o => o.includes(token)), `Missing option: ${token}`).toBe(true);
  }

  const bgRow = page.getByRole('row').filter({
    has: page.getByRole('cell', { name: 'backgroundColor', exact: true }),
  });
  await annotateAndScreenshot(page, bgRow, `${SCREENSHOTS_DIR}/sufi102-AC3-promo-card-storybook-control.png`, 'AC3 — backgroundColor');
});

// ── AC4 ───────────────────────────────────────────────────────────────────────

test('[SUFI-102][AC4] Card Contentful — campo backgroundColor incluye subtonalidades', async ({ page }) => {
  await loginContentful(page);
  await page.goto(
    `https://app.contentful.com/spaces/${CF_SPACE}/environments/${CF_ENV}/entries/${CF_CARD_ENTRY}`
  );

  // Background Color field is inside a cross-origin iframe rendered by Contentful's App Framework.
  // Wait for the group, then pause briefly — the cf-widget iframe reloads once during initialization
  // and allTextContents() would fail if called during that reload.
  const bgGroup = page.getByRole('group', { name: 'Background Color' });
  await bgGroup.waitFor({ timeout: 30000 });

  // Wait for the combobox inside the cf-widget iframe — this is the signal the iframe has stabilized
  const bgSelect = bgGroup.frameLocator('iframe').getByRole('combobox');
  await bgSelect.waitFor({ timeout: 15000 });
  const options = await bgSelect.locator('option').allTextContents();

  for (const token of SUB_TONES) {
    expect(options.some(o => o.includes(token)), `Missing option: ${token}`).toBe(true);
  }

  await annotateAndScreenshot(page, bgGroup, `${SCREENSHOTS_DIR}/sufi102-AC4-card-contentful-field.png`, 'AC4 — Background Color');
});

// ── AC5 ───────────────────────────────────────────────────────────────────────

test('[SUFI-102][AC5] Promotional Card Contentful — campo backgroundColor incluye subtonalidades', async ({ page }) => {
  await loginContentful(page);
  await page.goto(
    `https://app.contentful.com/spaces/${CF_SPACE}/environments/${CF_ENV}/entries/${CF_PROMO_ENTRY}`
  );

  const bgGroup = page.getByRole('group', { name: 'Background Color' });
  await bgGroup.waitFor({ timeout: 30000 });

  const bgSelect = bgGroup.frameLocator('iframe').getByRole('combobox');
  await bgSelect.waitFor({ timeout: 15000 });
  const options = await bgSelect.locator('option').allTextContents();

  for (const token of SUB_TONES) {
    expect(options.some(o => o.includes(token)), `Missing option: ${token}`).toBe(true);
  }

  await annotateAndScreenshot(page, bgGroup, `${SCREENSHOTS_DIR}/sufi102-AC5-promo-contentful-field.png`, 'AC5 — Background Color');
});

// ── AC6 ───────────────────────────────────────────────────────────────────────

test('[SUFI-102][AC6] Card DEV — renderiza color subtonalidad en /test-dev', async ({ page }) => {
  const componentErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error' && /card|color|background/i.test(msg.text()))
      componentErrors.push(msg.text());
  });

  await page.goto(`${DEV}/test-dev`);
  await handleVercelWall(page);
  await page.waitForLoadState('networkidle');

  // Confirmed class prefix from DOM inspection
  const card = page.locator('[class*="ml-card__vertical-start"]').first();
  await card.waitFor({ timeout: 15000 });

  const bg = await card.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(bg, 'Card background color not applied').not.toBe('rgba(0, 0, 0, 0)');

  expect(componentErrors, `Component errors: ${componentErrors.join('; ')}`).toHaveLength(0);
  await annotateAndScreenshot(page, card, `${SCREENSHOTS_DIR}/sufi102-AC6-card-dev-desktop.png`, 'AC6 — Card');
});

// ── AC7 ───────────────────────────────────────────────────────────────────────

test('[SUFI-102][AC7] Promotional Card DEV — renderiza color subtonalidad en /test-dev', async ({ page }) => {
  const componentErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error' && /promo|card|color|background/i.test(msg.text()))
      componentErrors.push(msg.text());
  });

  await page.goto(`${DEV}/test-dev`);
  await handleVercelWall(page);
  await page.waitForLoadState('networkidle');

  // Confirmed class prefix from DOM inspection
  const promo = page.locator('[class*="or-promotional-card__horizontal-container"]').first();
  await promo.waitFor({ timeout: 15000 });

  const bg = await promo.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(bg, 'Promotional Card background color not applied').not.toBe('rgba(0, 0, 0, 0)');

  expect(componentErrors, `Component errors: ${componentErrors.join('; ')}`).toHaveLength(0);
  await annotateAndScreenshot(page, promo, `${SCREENSHOTS_DIR}/sufi102-AC7-promo-card-dev-desktop.png`, 'AC7 — Promotional Card');
});

// ── AC8 ───────────────────────────────────────────────────────────────────────

test('[SUFI-102][AC8] Responsivo — Card y Promotional Card en tablet y móvil', async ({ page }) => {
  const componentErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error' && /card|color|background/i.test(msg.text()))
      componentErrors.push(msg.text());
  });

  const viewports = [
    { label: 'tablet', width: 768, height: 1024 },
    { label: 'mobile', width: 375, height: 812 },
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${DEV}/test-dev`);
    await handleVercelWall(page);
    await page.waitForLoadState('networkidle');

    const card = page.locator('[class*="ml-card__vertical-start"]').first();
    const promo = page.locator('[class*="or-promotional-card__horizontal-container"]').first();

    await expect(card, `Card not visible at ${vp.label}`).toBeVisible({ timeout: 15000 });
    await expect(promo, `Promo Card not visible at ${vp.label}`).toBeVisible({ timeout: 15000 });

    const cardBox = await card.boundingBox();
    const promoBox = await promo.boundingBox();
    expect(cardBox!.width, `Card overflows at ${vp.label}`).toBeLessThanOrEqual(vp.width);
    expect(promoBox!.width, `Promo Card overflows at ${vp.label}`).toBeLessThanOrEqual(vp.width);

    await annotateAndScreenshot(page, card, `${SCREENSHOTS_DIR}/sufi102-AC8-${vp.label}.png`, `AC8 — Card ${vp.width}px`);
  }

  expect(componentErrors, `Component errors: ${componentErrors.join('; ')}`).toHaveLength(0);
});
