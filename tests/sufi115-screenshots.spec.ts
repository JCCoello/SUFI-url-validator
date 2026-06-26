// spec: SUFI-115 accessibility verification screenshots
// Takes 5 real browser screenshots with red outline + AC badge overlay

import { test } from '@playwright/test';
import * as path from 'path';

const OUTPUT_DIR = '/Users/coello/SUFI-url-validator/reports/QA/manual-runs/SUFI-115';

async function injectBadge(page: any, badgeText: string) {
  await page.evaluate((text: string) => {
    document.getElementById('__qa-label')?.remove();
    const badge = document.createElement('div');
    badge.id = '__qa-label';
    badge.style.cssText =
      'position:fixed;top:12px;right:12px;z-index:99999;background:#D32F2F;color:white;font-family:monospace;font-size:14px;padding:6px 12px;border-radius:4px;';
    badge.textContent = text;
    document.body.appendChild(badge);
  }, badgeText);
}

async function clearOutlines(page: any) {
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach((el: any) => (el.style.outline = ''));
  });
}

test.describe('SUFI-115 — Accessibility Screenshots', () => {
  test('Take all 5 AC annotated screenshots', async ({ page }) => {

    // ── Screenshot 1: AC1 — Storybook CTA button ──────────────────────────────

    // Authenticate on PROD first (sets cookie)
    await page.goto('https://sufi-app.vercel.app/');
    if (await page.getByRole('textbox', { name: 'Enter visitor password' }).isVisible()) {
      await page.getByRole('textbox', { name: 'Enter visitor password' }).fill('sufi-25-apply');
      await page.getByRole('button', { name: 'Unlock' }).click();
    }

    // Navigate to Storybook contextual item component
    await page.goto(
      'https://sufi-acl.vercel.app/iframe.html?id=molecules-contextual-item--default&viewMode=story'
    );

    // Authenticate on Storybook if needed
    if (await page.getByRole('textbox', { name: 'Enter visitor password' }).isVisible()) {
      await page.getByRole('textbox', { name: 'Enter visitor password' }).fill('sufi-25-apply');
      await page.getByRole('button', { name: 'Unlock' }).click();
    }

    // Wait for component to render
    await page.waitForSelector('.ml-contextual-item', { timeout: 15000 });

    // Inject red outline on the CTA button (Descargar guía)
    await page.evaluate(() => {
      const span = Array.from(document.querySelectorAll('span')).find((s: any) =>
        s.textContent?.includes('Descargar')
      ) as HTMLElement | undefined;
      const btn = span?.closest('button') as HTMLElement | null;
      if (btn) btn.style.outline = '3px solid red';
    });

    // AC1 badge
    await injectBadge(page, 'AC1 — a11y');

    // Screenshot 1
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'sufi115-AC1-a11y-storybook-cta.png'),
      fullPage: true,
    });

    // ── Screenshot 2: AC3 — horizontal layout, component container ─────────────

    await clearOutlines(page);

    // Inject red outline on the article container
    await page.evaluate(() => {
      const container = document.querySelector('.ml-contextual-item') as HTMLElement | null;
      if (container) container.style.outline = '3px solid red';
    });

    await injectBadge(page, 'AC3 — horizontal');

    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'sufi115-AC3-a11y-horizontal-no-regression.png'),
      fullPage: true,
    });

    // ── Screenshot 3: AC4 — DEV #contacto vertical live ───────────────────────

    // Navigate to DEV
    await page.goto('https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/');

    // Authenticate on DEV if needed
    if (await page.getByRole('textbox', { name: 'Enter visitor password' }).isVisible()) {
      await page.getByRole('textbox', { name: 'Enter visitor password' }).fill('sufi-25-apply');
      await page.getByRole('button', { name: 'Unlock' }).click();
    }

    // Dismiss any auto-opening modal
    await page.keyboard.press('Escape');

    // Navigate to #contacto section
    await page.goto('https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/#contacto');
    await page.keyboard.press('Escape');

    // Scroll to #contacto section
    await page.evaluate(() => {
      const contacto = document.getElementById('contacto');
      if (contacto) contacto.scrollIntoView({ behavior: 'instant', block: 'start' });
    });

    // Wait for component in contacto
    await page.waitForSelector('#contacto .ml-contextual-item', { timeout: 15000 });

    // Inject red outline on component and its button
    await page.evaluate(() => {
      document.querySelectorAll('*').forEach((el: any) => (el.style.outline = ''));
      const contacto = document.getElementById('contacto');
      const component = contacto?.querySelector('.ml-contextual-item') as HTMLElement | null;
      const btn = component?.querySelector('button') as HTMLElement | null;
      if (component) component.style.outline = '3px solid red';
      if (btn) btn.style.outline = '3px solid red';
    });

    await injectBadge(page, 'AC4 — vertical live');

    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'sufi115-AC4-a11y-dev-contacto-vertical.png'),
    });

    // ── Screenshot 4: AC5 — 768px responsive ──────────────────────────────────

    await page.setViewportSize({ width: 768, height: 1024 });

    await page.evaluate(() => {
      const contacto = document.getElementById('contacto');
      if (contacto) contacto.scrollIntoView({ behavior: 'instant', block: 'start' });
    });

    await page.evaluate(() => {
      document.querySelectorAll('*').forEach((el: any) => (el.style.outline = ''));
      const contacto = document.getElementById('contacto');
      const component = contacto?.querySelector('.ml-contextual-item') as HTMLElement | null;
      const btn = component?.querySelector('button') as HTMLElement | null;
      if (btn) btn.style.outline = '3px solid red';
    });

    await injectBadge(page, 'AC5 — 768px');

    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'sufi115-AC5-a11y-responsive-768px.png'),
    });

    // ── Screenshot 5: AC5 — 375px responsive ──────────────────────────────────

    await page.setViewportSize({ width: 375, height: 812 });

    await page.evaluate(() => {
      const contacto = document.getElementById('contacto');
      if (contacto) contacto.scrollIntoView({ behavior: 'instant', block: 'start' });
    });

    await page.evaluate(() => {
      document.querySelectorAll('*').forEach((el: any) => (el.style.outline = ''));
      const contacto = document.getElementById('contacto');
      const component = contacto?.querySelector('.ml-contextual-item') as HTMLElement | null;
      const btn = component?.querySelector('button') as HTMLElement | null;
      if (btn) btn.style.outline = '3px solid red';
    });

    await injectBadge(page, 'AC5 — 375px');

    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'sufi115-AC5-a11y-responsive-375px.png'),
    });
  });
});
