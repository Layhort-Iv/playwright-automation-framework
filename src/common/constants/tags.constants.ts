/**
 * Standard test tags for execution filtering via grep
 */
export const TestTags = {
  // Test Types
  UI: '@ui',
  API: '@api',
  VISUAL: '@visual',
  CONTRACT: '@contract',

  // Test Cadence & Severity
  SMOKE: '@smoke',
  SANITY: '@sanity',
  REGRESSION: '@regression',
  CRITICAL: '@critical',

  // Domain & Features
  AUTH: '@auth',
  INVENTORY: '@inventory',
  CHECKOUT: '@checkout',
  USERS: '@users',

  // Execution environment constraints
  LOCAL_ONLY: '@local-only',
  CI_ONLY: '@ci-only',
  SLOW: '@slow',
  FLAKY: '@flaky',
} as const;

export type TestTag = (typeof TestTags)[keyof typeof TestTags];
