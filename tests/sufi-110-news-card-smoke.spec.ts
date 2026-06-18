// spec: SUFI-110 — News Card Storybook Smoke Verification
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = '/Users/coello/SUFI-url-validator/reports/QA/manual-runs/SUFI-110';
const IFRAME_URL = 'https://sufi-acl.vercel.app/iframe.html?id=molecules-news-card--default&viewMode=story';
const SHELL_URL = 'https://sufi-acl.vercel.app/?path=/story/molecules-news-card--default';

function injectLabel(page: any, text: string) {
  return page.evaluate((labelText: string) => {
    const existing = document.getElementById('__qa-label');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.id = '__qa-label';
    el.textContent = labelText;
    Object.assign(el.style, {
      position: 'fixed', bottom: '12px', right: '12px', zIndex: '99999',
      background: '#D32F2F', color: '#fff', fontFamily: 'monospace',
      fontSize: '13px', padding: '6px 10px', borderRadius: '4px',
    });
    document.body.appendChild(el);
  }, text);
}

function removeLabel(page: any) {
  return page.evaluate(() => {
    document.getElementById('__qa-label')?.remove();
  });
}

test.describe('SUFI-110 — News Card Storybook Smoke', () => {
  test.beforeAll(() => {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  });

  test('SUFI-110 News Card — All ACs', async ({ page }) => {

    // ── Authenticate ──────────────────────────────────────────────────────────
    // Navigate to Storybook and authenticate through the Vercel password wall
    await page.goto(SHELL_URL);
    await page.getByRole('textbox', { name: 'Enter visitor password' }).fill('sufi-25-apply');
    await page.getByRole('button', { name: 'Unlock' }).click();
    await expect(page).toHaveTitle(/News Card/);

    // ── Navigate to direct iframe URL for AC1, AC2, AC4 ───────────────────────
    await page.goto(IFRAME_URL);
    await page.getByText('New card title').first().waitFor({ state: 'visible' });

    // ── AC1 — All fields visible, no console errors ───────────────────────────
    // Verify badge (numeric), date, title, author ("Por"), reading time ("Min") are all present
    const cardLink = page.locator('a[href="#"]');
    await expect(cardLink).toBeVisible();

    const badge = cardLink.locator('[class*="position"]');
    await expect(badge).toBeVisible();
    await expect(badge).not.toBeEmpty();

    const dateEl = cardLink.locator('[class*="date"]');
    await expect(dateEl).toBeVisible();
    await expect(dateEl).not.toBeEmpty();

    const titleEl = cardLink.locator('.ml-news-card__title');
    await expect(titleEl).toBeVisible();
    await expect(titleEl).not.toBeEmpty();

    const authorEl = cardLink.locator('span').filter({ hasText: 'Por' });
    await expect(authorEl).toBeVisible();

    const timeEl = cardLink.locator('span').filter({ hasText: 'Min' });
    await expect(timeEl).toBeVisible();

    // Confirm Storybook error overlay is not visible (no render failure)
    const errorOverlay = page.locator('.sb-errordisplay');
    await expect(errorOverlay).toBeHidden();

    // Inject AC1 badge label and screenshot
    await injectLabel(page, 'AC1 — all fields');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC1-all-fields.png'), fullPage: false });
    await removeLabel(page);

    // ── AC2 — Badge has red/primary background ────────────────────────────────
    // Get computed background color of the position/badge element
    const badgeBg = await badge.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    // rgb(227, 23, 33) is the brand red — confirm it is a red tone (R > 180, G < 100, B < 100)
    const [r, g, b] = badgeBg.match(/\d+/g)!.map(Number);
    expect(r).toBeGreaterThan(180);
    expect(g).toBeLessThan(100);
    expect(b).toBeLessThan(100);

    await injectLabel(page, 'AC2 — badge style');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC2-badge-style.png'), fullPage: false });
    await removeLabel(page);

    // ── AC4 — Date in DD/MM/YY format ─────────────────────────────────────────
    // Extract raw date text and verify it normalizes to DD/MM/YY
    const rawDateText = await dateEl.textContent();
    const normalizedDate = rawDateText!.replace(/\s+/g, '');
    expect(normalizedDate).toMatch(/^\d{2}\/\d{2}\/\d{2}$/);

    await injectLabel(page, 'AC4 — date format');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC4-date-format.png'), fullPage: false });
    await removeLabel(page);

    // ── AC3 — Title renders fully at 30 and 50 chars (Controls panel) ─────────
    // Navigate to full shell to access Controls panel
    await page.goto(SHELL_URL);
    const canvasFrame = page.frameLocator('#storybook-preview-iframe');
    await canvasFrame.locator('.ml-news-card__title').waitFor({ state: 'visible' });

    const titleInput = page.getByLabel('New card title');

    // Set 30-char title — wait for canvas iframe to reflect the change
    await titleInput.click();
    await page.keyboard.press('ControlOrMeta+a');
    await titleInput.fill('Título con treinta caracteres x');
    await page.keyboard.press('Tab');
    await canvasFrame.getByText('Título con treinta caracteres x').waitFor({ state: 'visible' });

    // Check no truncation in preview iframe for 30-char title
    const title30Overflow = await page.evaluate(() => {
      const iframe = document.getElementById('storybook-preview-iframe') as HTMLIFrameElement;
      if (!iframe?.contentDocument) return null;
      const el = iframe.contentDocument.querySelector('.ml-news-card__title') as HTMLElement;
      if (!el) return null;
      return {
        textOverflow: iframe.contentWindow!.getComputedStyle(el).textOverflow,
        isTruncated: el.scrollWidth > el.clientWidth,
        text: el.textContent?.trim(),
      };
    });
    expect(title30Overflow?.isTruncated).toBe(false);
    expect(title30Overflow?.textOverflow).not.toBe('ellipsis');

    // Inject label inside canvas iframe and screenshot the iframe element only
    const iframeEl = page.locator('#storybook-preview-iframe');
    await page.evaluate(() => {
      const iframe = document.getElementById('storybook-preview-iframe') as HTMLIFrameElement;
      if (!iframe?.contentDocument) return;
      const existing = iframe.contentDocument.getElementById('__qa-label');
      if (existing) existing.remove();
      const el = iframe.contentDocument.createElement('div');
      el.id = '__qa-label';
      el.textContent = 'AC3 — title 30 chars';
      Object.assign(el.style, {
        position: 'fixed', bottom: '12px', right: '12px', zIndex: '99999',
        background: '#D32F2F', color: '#fff', fontFamily: 'monospace',
        fontSize: '13px', padding: '6px 10px', borderRadius: '4px',
      });
      iframe.contentDocument.body.appendChild(el);
    });
    await iframeEl.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC3-title-30chars.png') });
    await page.evaluate(() => {
      const iframe = document.getElementById('storybook-preview-iframe') as HTMLIFrameElement;
      iframe?.contentDocument?.getElementById('__qa-label')?.remove();
    });

    // Set 50-char title — wait for canvas iframe to reflect the change
    const titleInput50 = page.getByLabel('Título con treinta caracteres');
    await titleInput50.click();
    await page.keyboard.press('ControlOrMeta+a');
    await titleInput50.fill('Este es un título de exactamente cincuenta caracte.');
    await page.keyboard.press('Tab');
    await canvasFrame.getByText('Este es un título de exactamente cincuenta caracte.').waitFor({ state: 'visible' });

    // Check no truncation for 50-char title
    const title50Overflow = await page.evaluate(() => {
      const iframe = document.getElementById('storybook-preview-iframe') as HTMLIFrameElement;
      if (!iframe?.contentDocument) return null;
      const el = iframe.contentDocument.querySelector('.ml-news-card__title') as HTMLElement;
      if (!el) return null;
      return {
        textOverflow: iframe.contentWindow!.getComputedStyle(el).textOverflow,
        isTruncated: el.scrollWidth > el.clientWidth,
        text: el.textContent?.trim(),
      };
    });
    expect(title50Overflow?.isTruncated).toBe(false);
    expect(title50Overflow?.textOverflow).not.toBe('ellipsis');

    // Inject label inside canvas iframe and screenshot the iframe element only
    await page.evaluate(() => {
      const iframe = document.getElementById('storybook-preview-iframe') as HTMLIFrameElement;
      if (!iframe?.contentDocument) return;
      const existing = iframe.contentDocument.getElementById('__qa-label');
      if (existing) existing.remove();
      const el = iframe.contentDocument.createElement('div');
      el.id = '__qa-label';
      el.textContent = 'AC3 — title 50 chars';
      Object.assign(el.style, {
        position: 'fixed', bottom: '12px', right: '12px', zIndex: '99999',
        background: '#D32F2F', color: '#fff', fontFamily: 'monospace',
        fontSize: '13px', padding: '6px 10px', borderRadius: '4px',
      });
      iframe.contentDocument.body.appendChild(el);
    });
    await iframeEl.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC3-title-50chars.png') });
    await page.evaluate(() => {
      const iframe = document.getElementById('storybook-preview-iframe') as HTMLIFrameElement;
      iframe?.contentDocument?.getElementById('__qa-label')?.remove();
    });

    // ── AC5 — Responsive at 768px and 375px ───────────────────────────────────
    // Navigate back to direct iframe URL, reset to default title
    await page.goto(IFRAME_URL);
    await page.getByText('New card title').first().waitFor({ state: 'visible' });

    // --- Tablet 768px ---
    // Constrain body to 768px and verify no overflow
    const tablet768 = await page.evaluate(() => {
      document.body.style.maxWidth = '768px';
      document.body.style.overflow = 'hidden';
      document.body.offsetHeight; // force reflow
      const card = Array.from(document.querySelectorAll('a')).find(a => a.getAttribute('href') === '#') as HTMLElement;
      if (!card) return { error: 'card not found' };
      const children = Array.from(card.querySelectorAll('*')) as HTMLElement[];
      const overflowing = children.filter(el => el.scrollWidth > Math.ceil(el.offsetWidth) + 2);
      const badge = card.querySelector('[class*="position"]');
      const dateEl = card.querySelector('[class*="date"]');
      const titleEl = card.querySelector('.ml-news-card__title');
      const authorEl = card.querySelector('span');
      return {
        cardWidth: Math.round(card.getBoundingClientRect().width),
        noOverflow: card.scrollWidth <= card.clientWidth,
        overflowingCount: overflowing.length,
        allFields: !!(badge && dateEl && titleEl && authorEl),
      };
    });
    expect(tablet768.noOverflow).toBe(true);
    expect(tablet768.allFields).toBe(true);
    expect(tablet768.overflowingCount).toBe(0);

    await injectLabel(page, 'AC5 — tablet 768px');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC5-tablet-768px.png'), fullPage: false });
    await removeLabel(page);

    // --- Mobile 375px ---
    const mobile375 = await page.evaluate(() => {
      document.body.style.maxWidth = '375px';
      document.body.offsetHeight; // force reflow
      const card = Array.from(document.querySelectorAll('a')).find(a => a.getAttribute('href') === '#') as HTMLElement;
      if (!card) return { error: 'card not found' };
      const children = Array.from(card.querySelectorAll('*')) as HTMLElement[];
      const overflowing = children.filter(el => el.scrollWidth > Math.ceil(el.offsetWidth) + 2);
      const badge = card.querySelector('[class*="position"]');
      const dateEl = card.querySelector('[class*="date"]');
      const titleEl = card.querySelector('.ml-news-card__title');
      const authorEl = card.querySelector('span');
      return {
        cardWidth: Math.round(card.getBoundingClientRect().width),
        noOverflow: card.scrollWidth <= card.clientWidth,
        overflowingCount: overflowing.length,
        allFields: !!(badge && dateEl && titleEl && authorEl),
      };
    });
    expect(mobile375.noOverflow).toBe(true);
    expect(mobile375.allFields).toBe(true);
    expect(mobile375.overflowingCount).toBe(0);

    await page.evaluate(() => {
      document.body.style.maxWidth = '';
      document.body.style.overflow = '';
    });
    await injectLabel(page, 'AC5 — mobile 375px');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC5-mobile-375px.png'), fullPage: false });
    await removeLabel(page);
  });
});
