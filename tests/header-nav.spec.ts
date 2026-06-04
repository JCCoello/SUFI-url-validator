/**
 * Header navigation link health check.
 *
 * Loads the SUFI preview homepage, collects every <a href> inside the header,
 * and asserts each one returns HTTP 200 after following redirects.
 *
 * Dropdown-trigger buttons (Negocios Especializados, Comercios aliados, etc.)
 * have no href and are skipped — they are covered by separate interaction tests.
 *
 * Run:
 *   npx playwright test tests/header-nav.spec.ts
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://sufi-app.vercel.app';
const VERCEL_PASSWORD = process.env.VERCEL_BYPASS_TOKEN ?? 'sufi-25-apply';

test.describe('Header — link health check', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);

    // Handle Vercel password-protection screen if present
    const passwordBox = page.getByRole('textbox', { name: 'Enter visitor password' });
    if (await passwordBox.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await passwordBox.fill(VERCEL_PASSWORD);
      await page.getByRole('button', { name: 'Unlock' }).click();
      await expect(page).not.toHaveTitle('Authentication Required', { timeout: 10_000 });
    }

    // Wait for React to hydrate the header — links are injected after initial render
    await page.waitForLoadState('networkidle');
    await page.locator('header a[href]').first().waitFor({ state: 'attached', timeout: 15_000 });
  });

  test('all header links respond with HTTP 200', async ({ page }) => {
    // Collect every anchor with an href inside <header>
    const linkEls = page.locator('header a[href]');
    const count = await linkEls.count();

    const results: Array<{
      label: string;
      href: string;
      status: number | null;
      error: string | null;
    }> = [];

    for (let i = 0; i < count; i++) {
      const el = linkEls.nth(i);
      const href = await el.getAttribute('href');
      const label =
        (await el.getAttribute('aria-label')) ||
        (await el.innerText()).trim() ||
        '(icon link)';

      // Skip anchors, mailto, tel — not HTTP resources
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        continue;
      }

      const fullUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;

      try {
        // page.request shares the page's cookie jar so _vercel_jwt is sent
        // automatically for internal links; external links are unaffected.
        const response = await page.request.get(fullUrl, { failOnStatusCode: false });
        results.push({ label, href: fullUrl, status: response.status(), error: null });
      } catch (err) {
        results.push({ label, href: fullUrl, status: null, error: String(err) });
      }
    }

    // Print a result line for every link (visible in Playwright list reporter)
    console.log(`\nHeader links checked: ${results.length}`);
    for (const r of results) {
      const tag = r.status === 200 ? 'PASS' : 'FAIL';
      const scope = r.href.startsWith(BASE_URL) ? 'internal' : 'external';
      console.log(`  [${tag}][${scope}] "${r.label}" → ${r.href} — ${r.status ?? r.error}`);
    }

    const failures = results.filter((r) => r.status !== 200);

    expect(
      failures.length,
      `\n${failures.length} header link(s) returned non-200:\n` +
        failures
          .map((f) => `  • "${f.label}" → ${f.href} — HTTP ${f.status ?? f.error}`)
          .join('\n')
    ).toBe(0);
  });
});
