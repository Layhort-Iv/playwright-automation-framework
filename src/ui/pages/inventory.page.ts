import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { HeaderLayout } from '../layouts/header.layout';
import { SidebarLayout } from '../layouts/sidebar.layout';
import { FooterLayout } from '../layouts/footer.layout';
import { DropdownWidget } from '../widgets/dropdown.widget';
import { ScopedLogger, logger } from '../../core/logging';

/**
 * Inventory / Catalog Page Object.
 * Demonstrates composition by embedding Header, Sidebar, and Footer layouts.
 */
export class InventoryPage extends BasePage {
  // Composed Layouts & Widgets
  public readonly header: HeaderLayout;
  public readonly sidebar: SidebarLayout;
  public readonly footer: FooterLayout;
  public readonly sortDropdown: DropdownWidget;

  // Page Specific Locators
  public readonly inventoryContainer: Locator;
  public readonly inventoryItems: Locator;
  public readonly inventoryItemNames: Locator;
  public readonly inventoryItemPrices: Locator;

  constructor(page: Page, pageLogger: ScopedLogger = logger) {
    super(page, pageLogger);
    this.header = new HeaderLayout(page);
    this.sidebar = new SidebarLayout(page);
    this.footer = new FooterLayout(page);

    const sortSelect = page.locator(
      '[data-test="product-sort-container"], .product_sort_container',
    );
    this.sortDropdown = new DropdownWidget(page, sortSelect);

    this.inventoryContainer = page.locator('#inventory_container, .inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.inventoryItemNames = page.locator('.inventory_item_name');
    this.inventoryItemPrices = page.locator('.inventory_item_price');
  }

  public async waitForPageLoaded(): Promise<void> {
    await expect(this.inventoryContainer.first()).toBeVisible();
  }

  public async getItemCount(): Promise<number> {
    await this.waitForPageLoaded();
    return await this.inventoryItems.count();
  }

  public async getAllItemNames(): Promise<string[]> {
    await this.waitForPageLoaded();
    return await this.inventoryItemNames.allInnerTexts();
  }

  public async addItemToCartByName(itemName: string): Promise<void> {
    const itemContainer = this.page.locator('.inventory_item', {
      has: this.page.locator('.inventory_item_name', { hasText: itemName }),
    });
    const addButton = itemContainer.locator(
      'button:has-text("Add to cart"), [data-test^="add-to-cart"]',
    );
    await this.clickElement(addButton, `Add to cart button for "${itemName}"`);
  }

  public async removeItemFromCartByName(itemName: string): Promise<void> {
    const itemContainer = this.page.locator('.inventory_item', {
      has: this.page.locator('.inventory_item_name', { hasText: itemName }),
    });
    const removeButton = itemContainer.locator('button:has-text("Remove"), [data-test^="remove"]');
    await this.clickElement(removeButton, `Remove from cart button for "${itemName}"`);
  }

  public async selectSortOption(optionValue: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectByValue(optionValue);
  }
}
