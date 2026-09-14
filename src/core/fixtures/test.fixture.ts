import { test as base, Page } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { config, EnvConfig } from '../config';
import { LoggerService, ScopedLogger } from '../logging';
import { BaseApiClient } from '../../api/client/base-api.client';
import { BearerAuthStrategy } from '../../api/auth/bearer-auth.strategy';
import { ApiKeyAuthStrategy } from '../../api/auth/api-key-auth.strategy';
import { UserApiClient } from '../../api/domain-clients/user-api.client';
import { AuthApiClient } from '../../api/domain-clients/auth-api.client';
import { LoginPage } from '../../ui/pages/login.page';
import { InventoryPage } from '../../ui/pages/inventory.page';
import { CheckoutPage } from '../../ui/pages/checkout.page';
import { UserModel } from '../../data/models/user.model';
import { UserFactory } from '../../data/factories/user.factory';

/**
 * Custom fixture types definition for the enterprise test runner
 */
export interface EnterpriseFixtures {
  // Infrastructure Fixtures
  envConfig: EnvConfig;
  correlationId: string;
  testLogger: ScopedLogger;

  // API Fixtures
  apiClient: BaseApiClient;
  userApiClient: UserApiClient;
  authApiClient: AuthApiClient;

  // UI Page Objects Fixtures
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  checkoutPage: CheckoutPage;

  // Authenticated State Fixture
  authenticatedPage: Page;

  // Test Data Fixtures
  testUser: UserModel;
}

/**
 * Extended Playwright test instance with enterprise fixtures.
 */
export const test = base.extend<EnterpriseFixtures>({
  // Active validated environment configuration
  envConfig: async ({}, use) => {
    await use(config);
  },

  // Unique Correlation ID per test
  correlationId: async ({}, use) => {
    const id = uuidv4();
    await use(id);
  },

  // Scoped Logger with automatic test lifecycle tracing
  testLogger: async ({ correlationId }, use, testInfo) => {
    const logger = LoggerService.getInstance().getLogger(correlationId);
    logger.logTestStart(testInfo.title, testInfo.tags);
    const startTime = Date.now();

    await use(logger);

    const duration = Date.now() - startTime;
    logger.logTestEnd(testInfo.title, testInfo.status || 'unknown', duration);
  },

  // Dynamic user data generation
  testUser: async ({}, use) => {
    const user = UserFactory.createStandardUser();
    await use(user);
  },

  // Base API Client initialized with active baseUrl & configured strategy
  apiClient: async ({ request, envConfig, testLogger }, use) => {
    const client = new BaseApiClient(request, envConfig.API_BASE_URL, testLogger);
    if (envConfig.AUTH_TYPE === 'apikey' && envConfig.API_KEY) {
      client.setAuthStrategy(new ApiKeyAuthStrategy(envConfig.API_KEY, { keyName: 'x-api-key' }));
    } else if (
      envConfig.AUTH_TYPE === 'bearer' &&
      envConfig.AUTH_TOKEN &&
      envConfig.AUTH_TOKEN !== 'mock_bearer_token' &&
      !envConfig.AUTH_TOKEN.startsWith('mock_')
    ) {
      client.setAuthStrategy(new BearerAuthStrategy(envConfig.AUTH_TOKEN));
    }
    await use(client);
  },

  // Domain API Clients
  userApiClient: async ({ apiClient }, use) => {
    await use(new UserApiClient(apiClient));
  },

  authApiClient: async ({ apiClient }, use) => {
    await use(new AuthApiClient(apiClient));
  },

  // UI Page Objects
  loginPage: async ({ page, testLogger }, use) => {
    await use(new LoginPage(page, testLogger));
  },

  inventoryPage: async ({ page, testLogger }, use) => {
    await use(new InventoryPage(page, testLogger));
  },

  checkoutPage: async ({ page, testLogger }, use) => {
    await use(new CheckoutPage(page, testLogger));
  },

  // Authenticated Page: logs in automatically and yields authenticated page
  authenticatedPage: async ({ page, loginPage, inventoryPage }, use) => {
    await loginPage.navigate();
    await loginPage.login({
      username: config.STANDARD_USERNAME,
      password: config.STANDARD_PASSWORD,
    });
    await inventoryPage.waitForPageLoaded();
    await use(page);
  },
});

export { expect } from '@playwright/test';
