import { defineConfig, devices } from '@playwright/test';
import { config } from './src/core/config';

/**
 * Enterprise Playwright Configuration.
 * Fully parameterized from validated environment settings.
 * Supports cross-browser matrices, sharding, and dual reporting.
 */
export default defineConfig({
  testDir: './tests',
  timeout: config.TIMEOUT,
  expect: {
    timeout: config.EXPECT_TIMEOUT,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : config.RETRIES,
  workers: process.env.CI ? 2 : config.WORKERS,

  // Dual Reporting Strategy: HTML + Allure
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'reports/playwright-html',
        open: 'never',
      },
    ],
    [
      'allure-playwright',
      {
        detail: true,
        resultsDir: 'allure-results',
        suiteTitle: true,
      },
    ],
    ['json', { outputFile: 'reports/test-results.json' }],
  ],

  use: {
    baseURL: config.BASE_URL,
    headless: config.HEADLESS,
    actionTimeout: config.ACTION_TIMEOUT,
    navigationTimeout: config.NAVIGATION_TIMEOUT,
    trace: config.RECORD_TRACE,
    screenshot: config.TAKE_SCREENSHOT,
    video: config.RECORD_VIDEO,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      Accept: 'application/json, text/plain, */*',
    },
  },

  projects: [
    // UI Projects
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\.spec\.ts/,
      testIgnore: /tests\/api\/.*/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /.*\.spec\.ts/,
      testIgnore: /tests\/api\/.*/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: /.*\.spec\.ts/,
      testIgnore: /tests\/api\/.*/,
    },

    // API Dedicated Project (Headless without browser overhead)
    {
      name: 'api',
      testDir: './tests/api',
      testMatch: /.*\.spec\.ts/,
      use: {
        baseURL: config.API_BASE_URL,
      },
    },
  ],

  outputDir: 'test-results/',
});
