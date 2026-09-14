import { test, expect } from '../../../src/core/fixtures';
import { ReportHelper } from '../../../src/core/reporting';

test.describe(
  'Catalog & Inventory - Regression Suite',
  { tag: ['@ui', '@regression', '@inventory'] },
  () => {
    test.beforeEach(async ({ authenticatedPage: _authenticatedPage }) => {
      ReportHelper.setAllureMetadata({
        epic: 'E-Commerce Core',
        feature: 'Catalog Inventory',
        story: 'Item Browsing and Cart Operations',
        severity: 'normal',
      });
    });

    test('TC-INV-001: Display catalog items with correct names and prices', async ({
      inventoryPage,
    }) => {
      await inventoryPage.waitForPageLoaded();
      const count = await inventoryPage.getItemCount();
      expect(count).toBe(6);

      const names = await inventoryPage.getAllItemNames();
      expect(names).toContain('Sauce Labs Backpack');
      expect(names).toContain('Sauce Labs Bike Light');
    });

    test('TC-INV-002: Add item to cart updates cart badge counter', async ({ inventoryPage }) => {
      await inventoryPage.waitForPageLoaded();

      const initialCount = await inventoryPage.header.getCartCount();
      expect(initialCount).toBe(0);

      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');

      const updatedCount = await inventoryPage.header.getCartCount();
      expect(updatedCount).toBe(1);

      // Clean up
      await inventoryPage.removeItemFromCartByName('Sauce Labs Backpack');
      const finalCount = await inventoryPage.header.getCartCount();
      expect(finalCount).toBe(0);
    });

    test('TC-INV-003: Sort catalog items by price from low to high', async ({ inventoryPage }) => {
      await inventoryPage.waitForPageLoaded();
      await inventoryPage.selectSortOption('lohi');

      const pricesText = await inventoryPage.inventoryItemPrices.allInnerTexts();
      const prices = pricesText.map(p => parseFloat(p.replace('$', '')));

      // Assert ascending order
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
      }
    });
  },
);
