import { test } from '@playwright/test';

test('seed', async ({ page }) => {
  await page.goto('https://sufi-acl.vercel.app/iframe.html?id=molecules-news-card--default&viewMode=story');
  const pwInput = page.locator('input[type="password"]').first();
  if (await pwInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await pwInput.fill('sufi-25-apply');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
  }
});
