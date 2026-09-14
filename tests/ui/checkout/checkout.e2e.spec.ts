import { test, expect } from '../../../src/core/fixtures';
import { ReportHelper } from '../../../src/core/reporting';
import { OrderBuilder } from '../../../src/data/builders/order.builder';

test.describe(
  'Checkout - End-to-End Suite',
  { tag: ['@ui', '@e2e', '@regression', '@checkout'] },
  () => {
    test('TC-CHK-001: Complete an end-to-end purchase flow with dynamic customer info', async ({
      authenticatedPage: _page,
      inventoryPage,
      checkoutPage,
      testLogger,
    }) => {
      ReportHelper.setAllureMetadata({
        epic: 'E-Commerce Core',
        feature: 'Checkout Flow',
        story: 'End-to-End Order Placement',
        severity: 'critical',
      });

      testLogger.info('Starting E2E Checkout Flow');

      // 1. Add item to cart
      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      expect(await inventoryPage.header.getCartCount()).toBe(1);

      // 2. Open shopping cart
      await inventoryPage.header.clickCart();

      // 3. Click Checkout button on cart page
      const checkoutButton = inventoryPage.page.locator('[data-test="checkout"], #checkout');
      await inventoryPage.clickElement(checkoutButton, 'Cart Checkout Button');

      // 4. Fill shipping information using dynamic OrderBuilder
      const orderData = OrderBuilder.anOrder().build();
      testLogger.info(
        `Filling checkout info for customer: ${orderData.firstName} ${orderData.lastName}`,
      );

      await checkoutPage.fillInformation({
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        postalCode: orderData.postalCode,
      });

      // 5. Complete order
      await checkoutPage.clickFinish();

      // 6. Verify success confirmation
      const message = await checkoutPage.getOrderConfirmationMessage();
      expect(message).toBe('Thank you for your order!');
      testLogger.info('Checkout completed successfully');
    });
  },
);
