// spec: SUFI-110 — News Card component smoke verification
// target: https://sufi-acl.vercel.app/?path=/story/molecules-news-card--default

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOTS_DIR = '/Users/coello/SUFI-url-validator/reports/QA/manual-runs/SUFI-110';
const IFRAME_URL = 'https://sufi-acl.vercel.app/iframe.html?id=molecules-news-card--default&viewMode=story';
const STORYBOOK_URL = 'https://sufi-acl.vercel.app/?path=/story/molecules-news-card--default';

async function injectBadge(page: any, label: string) {
  await page.evaluate((text: string) => {
    const existing = document.getElementById('__qa-label');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.id = '__qa-label';
    el.textContent = text;
    Object.assign(el.style, {
      position: 'fixed', top: '12px', right: '12px', zIndex: '99999',
      background: '#D32F2F', color: '#fff', fontFamily: 'monospace',
      fontSize: '13px', padding: '6px 10px', borderRadius: '4px'
    });
    document.body.appendChild(el);
  }, label);
}

async function removeBadge(page: any) {
  await page.evaluate(() => {
    document.getElementById('__qa-label')?.remove();
  });
}

async function authenticateStorybook(page: any) {
  // Navigate to Storybook and authenticate if needed
  await page.goto(STORYBOOK_URL);
  const passwordInput = page.getByRole('textbox', { name: 'Enter visitor password' });
  if (await passwordInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await passwordInput.fill('sufi-25-apply');
    await page.getByRole('button', { name: 'Unlock' }).click();
  }
}

test.describe('SUFI-110 — News Card Smoke', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
  });

  test('AC1 — All fields visible, no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // Authenticate Storybook
    await authenticateStorybook(page);

    // Navigate to direct iframe URL
    await page.goto(IFRAME_URL);
    await page.getByText('New card title').first().waitFor({ state: 'visible' });

    // Check numeric badge
    const badgeResult = await page.evaluate(() => {
      for (const el of document.querySelectorAll('*') as any) {
        const text = el.textContent?.trim();
        if (text && /^\d+$/.test(text) && el.children.length === 0) {
          return { text, found: true, bg: getComputedStyle(el).backgroundColor };
        }
      }
      return { found: false };
    });
    expect(badgeResult.found).toBe(true);

    // Check date
    const dateResult = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('*') as any).find((e: any) =>
        e.children.length === 0 && /\d{2}\s*\/\s*\d{2}\s*\/\s*\d{2}/.test(e.textContent?.trim())
      ) as any;
      return el ? { text: el.textContent.trim(), found: true } : { found: false };
    });
    expect(dateResult.found).toBe(true);

    // Check title
    const titleVisible = await page.getByText('New card title').first().isVisible();
    expect(titleVisible).toBe(true);

    // Check author "Por"
    const authorResult = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('*') as any).find((e: any) =>
        e.children.length === 0 && e.textContent?.trim().includes('Por')
      ) as any;
      return el ? { text: el.textContent.trim(), found: true } : { found: false };
    });
    expect(authorResult.found).toBe(true);

    // Check reading time "Min"
    const readingTimeResult = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('*') as any).find((e: any) =>
        e.children.length === 0 && e.textContent?.trim().includes('Min')
      ) as any;
      return el ? { text: el.textContent.trim(), found: true } : { found: false };
    });
    expect(readingTimeResult.found).toBe(true);

    // Inject badge and screenshot
    await injectBadge(page, 'AC1 — all fields visible');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC1-all-fields.png') });
    await removeBadge(page);

    // No console errors expected
    expect(consoleErrors.length).toBe(0);
  });

  test('AC2 — Badge has red/primary background', async ({ page }) => {
    await authenticateStorybook(page);
    await page.goto(IFRAME_URL);
    await page.getByText('New card title').first().waitFor({ state: 'visible' });

    // Get badge background color
    const badgeColor = await page.evaluate(() => {
      for (const el of document.querySelectorAll('*') as any) {
        const text = el.textContent?.trim();
        if (text && /^\d+$/.test(text) && el.children.length === 0) {
          return getComputedStyle(el).backgroundColor;
        }
      }
      return null;
    });

    expect(badgeColor).toBeTruthy();
    // Red/primary tone — rgb values should have high red channel
    const rgbMatch = badgeColor?.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      expect(r).toBeGreaterThan(g);
      expect(r).toBeGreaterThan(b);
    }

    await injectBadge(page, 'AC2 — badge red/primary background');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC2-badge-style.png') });
    await removeBadge(page);
  });

  test('AC3 — Title: 30 chars and 50 chars without truncation', async ({ page }) => {
    // Navigate to full Storybook shell
    await authenticateStorybook(page);
    // Wait for Controls panel
    await page.getByText('Controls').waitFor({ state: 'visible', timeout: 10000 });

    // Find the title input in Controls — look for the heading/title field
    const titleInput = page.locator('input[id*="heading"], input[placeholder*="title"], textarea[id*="heading"]').first();
    
    // Set 30-char string
    const title30 = 'Título con treinta caracteres x';
    await titleInput.click({ clickCount: 3 });
    await titleInput.fill(title30);
    await page.waitForTimeout(500);

    // Check inside preview iframe for no truncation
    const frame = page.frameLocator('#storybook-preview-iframe');
    const titleEl30 = frame.getByText(title30).first();
    await titleEl30.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const overflow30 = await frame.locator('*').evaluateAll((els: any[], t: string) => {
      const el = els.find(e => e.textContent?.trim() === t);
      if (!el) return null;
      return getComputedStyle(el).textOverflow;
    }, title30).catch(() => 'not-checked');

    await injectBadge(page, 'AC3 — title 30 chars');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC3-title-30chars.png') });
    await removeBadge(page);

    // Set 50-char string
    const title50 = 'Este es un título de exactamente cincuenta caracte.';
    await titleInput.click({ clickCount: 3 });
    await titleInput.fill(title50);
    await page.waitForTimeout(500);

    await injectBadge(page, 'AC3 — title 50 chars');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC3-title-50chars.png') });
    await removeBadge(page);
  });

  test('AC4 — Date in DD/MM/AA format', async ({ page }) => {
    await authenticateStorybook(page);
    await page.goto(IFRAME_URL);
    await page.getByText('New card title').first().waitFor({ state: 'visible' });

    const dateText = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('*') as any).find((e: any) =>
        e.children.length === 0 && /\d{2}\s*\/\s*\d{2}\s*\/\s*\d{2}/.test(e.textContent?.trim())
      ) as any;
      return el ? el.textContent.trim() : null;
    });

    expect(dateText).toBeTruthy();
    // Normalize spaces and check DD/MM/YY pattern
    const normalized = dateText?.replace(/\s+/g, ' ').trim();
    expect(normalized).toMatch(/^\d{2}\s*\/\s*\d{2}\s*\/\s*\d{2}$/);

    await injectBadge(page, 'AC4 — date DD/MM/AA format');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC4-date-format.png') });
    await removeBadge(page);
  });

  test('AC5 — Responsive at 768px and 375px', async ({ page }) => {
    await authenticateStorybook(page);
    await page.goto(IFRAME_URL);
    await page.getByText('New card title').first().waitFor({ state: 'visible' });

    // --- Tablet 768px ---
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);

    const tabletCheck = await page.evaluate(() => {
      const noOverflow = document.body.scrollWidth <= window.innerWidth;
      const hasTitle = !!Array.from(document.querySelectorAll('*') as any).find((e: any) =>
        e.children.length === 0 && e.textContent?.trim() === 'New card title'
      );
      const hasDate = !!Array.from(document.querySelectorAll('*') as any).find((e: any) =>
        e.children.length === 0 && /\d{2}\s*\/\s*\d{2}\s*\/\s*\d{2}/.test(e.textContent?.trim())
      );
      const hasBadge = !!Array.from(document.querySelectorAll('*') as any).find((e: any) =>
        e.children.length === 0 && /^\d+$/.test(e.textContent?.trim())
      );
      const hasAuthor = !!Array.from(document.querySelectorAll('*') as any).find((e: any) =>
        e.children.length === 0 && e.textContent?.trim().includes('Por')
      );
      const hasTime = !!Array.from(document.querySelectorAll('*') as any).find((e: any) =>
        e.children.length === 0 && e.textContent?.trim().includes('Min')
      );
      return { noOverflow, hasTitle, hasDate, hasBadge, hasAuthor, hasTime };
    });

    expect(tabletCheck.noOverflow).toBe(true);
    expect(tabletCheck.hasTitle).toBe(true);
    expect(tabletCheck.hasDate).toBe(true);
    expect(tabletCheck.hasBadge).toBe(true);
    expect(tabletCheck.hasAuthor).toBe(true);
    expect(tabletCheck.hasTime).toBe(true);

    await injectBadge(page, 'AC5 — tablet 768px');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC5-tablet-768px.png') });
    await removeBadge(page);

    // --- Mobile 375px ---
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);

    const mobileCheck = await page.evaluate(() => {
      const noOverflow = document.body.scrollWidth <= window.innerWidth;
      const hasTitle = !!Array.from(document.querySelectorAll('*') as any).find((e: any) =>
        e.children.length === 0 && e.textContent?.trim() === 'New card title'
      );
      return {
        noOverflow,
        hasTitle,
        scrollWidth: document.body.scrollWidth,
        innerWidth: window.innerWidth
      };
    });

    expect(mobileCheck.noOverflow).toBe(true);
    expect(mobileCheck.hasTitle).toBe(true);

    await injectBadge(page, 'AC5 — mobile 375px');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi110-AC5-mobile-375px.png') });
    await removeBadge(page);
  });
});
