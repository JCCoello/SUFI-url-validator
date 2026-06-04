import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  // Tests run sequentially — concurrency is managed inside the spec via p-limit
  workers: 1,

  // Allow up to 15 min for large URL batches
  timeout: 900_000,

  globalSetup: './src/globalSetup.ts',
  globalTeardown: './src/globalTeardown.ts',

  retries: 0,

  reporter: [
    ['list'],
    ['html', { outputFolder: './reports/playwright-html', open: 'never' }],
    ['json', { outputFile: './reports/playwright-results.json' }],
    ['allure-playwright', {
      outputFolder: './allure-results',
      suiteTitle: false,
      detail: false,
      environmentInfo: {
        project: 'SUFI — URL Validator',
        node_version: process.version,
      },
    }],
  ],

  use: {
    trace: 'on-first-retry',
  },
});
