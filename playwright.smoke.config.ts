import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/sufi-*.spec.ts',
  workers: 1,
  timeout: 120_000,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: './reports/playwright-html', open: 'never' }],
  ],
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
