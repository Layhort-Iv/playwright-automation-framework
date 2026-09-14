import { test, expect } from '../../../src/core/fixtures';
import { ReportHelper } from '../../../src/core/reporting';

test.describe(
  'Authentication - Smoke Suite',
  { tag: ['@ui', '@smoke', '@critical', '@auth'] },
  () => {
    test.beforeEach(async ({ loginPage }) => {
      ReportHelper.setAllureMetadata({
        epic: 'User Management',
        feature: 'Authentication',
        story: 'Login',
        severity: 'critical',
      });
      await loginPage.navigate();
    });

    test('TC-LOGIN-001: Successfully log in with standard credentials', async ({
      loginPage,
      inventoryPage,
      envConfig,
      testLogger,
    }) => {
      testLogger.info('Executing TC-LOGIN-001 with standard user');

      await loginPage.login({
        username: envConfig.STANDARD_USERNAME,
        password: envConfig.STANDARD_PASSWORD,
      });

      await inventoryPage.waitForPageLoaded();
      const itemCount = await inventoryPage.getItemCount();
      expect(itemCount).toBeGreaterThan(0);
      expect(inventoryPage.currentUrl).toContain('/inventory.html');
    });

    test('TC-LOGIN-002: Display error message when supplying invalid credentials', async ({
      loginPage,
      testLogger,
    }) => {
      testLogger.info('Executing TC-LOGIN-002 with invalid credentials');

      await loginPage.login({
        username: 'invalid_user',
        password: 'wrong_password',
      });

      const isErrorVisible = await loginPage.isErrorVisible();
      expect(isErrorVisible).toBe(true);

      const errorMessage = await loginPage.getErrorMessageText();
      expect(errorMessage).toContain('Username and password do not match');
    });

    test('TC-LOGIN-003: Display error message for locked out user', async ({
      loginPage,
      envConfig,
      testLogger,
    }) => {
      testLogger.info('Executing TC-LOGIN-003 with locked out user');

      await loginPage.login({
        username: 'locked_out_user',
        password: envConfig.STANDARD_PASSWORD,
      });

      const errorMessage = await loginPage.getErrorMessageText();
      expect(errorMessage).toContain('Sorry, this user has been locked out.');
    });
  },
);
