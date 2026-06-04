import { test } from '@playwright/test';

test('seed', async ({ page }) => {
  // Set Vercel password-protection cookie before navigating
  await page.context().addCookies([{
    name: '_vercel_jwt',
    value: process.env.VERCEL_JWT ?? '',
    domain: 'sufi-app.vercel.app',
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'Lax',
  }]);
  await page.goto('https://sufi-app.vercel.app');
});
