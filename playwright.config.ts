import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  // Tests directory
  testDir: './tests',

  // Test files pattern
  testMatch: '**/*.spec.ts',

  // Run tests sequentially — we handle our own concurrency via p-limit
  // inside the test to respect Contentful rate limits precisely.
  workers: 1,

  // 999 assets × ~300ms each = ~5 min. Set to 15 min to give headroom.
  timeout: 900_000,

  // Global setup injects validated env vars before any test runs
  globalSetup: './src/globalSetup.ts',

  // Global teardown sends the Slack report after all tests complete
  globalTeardown: './src/globalTeardown.ts',

  // Retry at the Playwright level as a last resort — primary retry logic
  // lives in the validator itself with exponential backoff.
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
        project: 'Banitsimo — Asset Validator',
        space_id: process.env.CONTENTFUL_SPACE_ID ?? 'catp2t59asao',
        environment: process.env.CONTENTFUL_ENVIRONMENT ?? 'master',
        node_version: process.version,
      },
    }],
  ],

  use: {
    // No browser needed — all requests are made via Playwright's APIRequestContext
    baseURL: `https://cdn.contentful.com`,

    // Extra HTTP headers applied to every API request
    extraHTTPHeaders: {
      'Authorization': `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN ?? ''}`,
      'Accept': 'application/json',
    },

    // Trace on first retry for debugging
    trace: 'on-first-retry',
  },

  // Projects allow running against different Contentful environments
  projects: [
    {
      name: 'production',
      use: {
        baseURL: 'https://cdn.contentful.com',
      },
    },
    {
      name: 'preview',
      use: {
        baseURL: 'https://preview.contentful.com',
        extraHTTPHeaders: {
          'Authorization': `Bearer ${process.env.CONTENTFUL_PREVIEW_TOKEN ?? process.env.CONTENTFUL_ACCESS_TOKEN ?? ''}`,
          'Accept': 'application/json',
        },
      },
    },
  ],
});
