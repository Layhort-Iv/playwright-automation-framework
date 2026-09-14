import { z } from 'zod';

const stringToBoolean = z
  .union([z.boolean(), z.string()])
  .transform(val => (typeof val === 'boolean' ? val : val.toLowerCase() === 'true'));

const stringToNumber = z
  .union([z.number(), z.string()])
  .transform(val => (typeof val === 'number' ? val : parseInt(val, 10)));

/**
 * Zod Schema for environment variable validation.
 * Enforces fail-fast configuration validation at framework initialization.
 */
export const EnvSchema = z.object({
  // Runtime Environment
  TEST_ENV: z.enum(['local', 'dev', 'qa', 'uat', 'staging', 'prod']).default('local'),

  // URLs
  BASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),

  // Execution Settings
  HEADLESS: stringToBoolean.default(true),
  BROWSER: z.enum(['chromium', 'firefox', 'webkit']).default('chromium'),
  WORKERS: stringToNumber.default(2),
  RETRIES: stringToNumber.default(0),
  TIMEOUT: stringToNumber.default(30000),
  EXPECT_TIMEOUT: stringToNumber.default(10000),
  ACTION_TIMEOUT: stringToNumber.default(15000),
  NAVIGATION_TIMEOUT: stringToNumber.default(30000),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  LOG_TO_CONSOLE: stringToBoolean.default(true),
  LOG_TO_FILE: stringToBoolean.default(true),
  LOG_DIR: z.string().default('logs'),

  // Credentials
  ADMIN_USERNAME: z.string().default('standard_user'),
  ADMIN_PASSWORD: z.string().default('secret_sauce'),
  STANDARD_USERNAME: z.string().default('standard_user'),
  STANDARD_PASSWORD: z.string().default('secret_sauce'),

  // API Authentication
  AUTH_TYPE: z.enum(['bearer', 'basic', 'apikey', 'oauth2']).default('bearer'),
  AUTH_TOKEN: z.string().optional().default('mock_bearer_token'),
  API_KEY: z.string().optional().default('mock_api_key'),
  AUTH_CLIENT_ID: z.string().optional().default('mock_client_id'),
  AUTH_CLIENT_SECRET: z.string().optional().default('mock_client_secret'),
  AUTH_TOKEN_URL: z.string().url().optional().default('https://reqres.in/api/login'),

  // Artifact & Reporting Settings
  GENERATE_ALLURE: stringToBoolean.default(true),
  RECORD_VIDEO: z
    .enum(['off', 'on', 'retain-on-failure', 'on-first-retry'])
    .default('retain-on-failure'),
  RECORD_TRACE: z
    .enum(['off', 'on', 'retain-on-failure', 'on-first-retry'])
    .default('retain-on-failure'),
  TAKE_SCREENSHOT: z.enum(['off', 'on', 'only-on-failure']).default('only-on-failure'),
});

export type EnvConfig = z.infer<typeof EnvSchema>;
