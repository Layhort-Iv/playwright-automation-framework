import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';

/**
 * Header Layout Object representing top navigation across pages.
 */
export class HeaderLayout extends BasePage {
  public readonly logo: Locator;
  public readonly menuButton: Locator;
  public readonly cartButton: Locator;
  public readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.locator('.app_logo');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.cartButton = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  public async openMenu(): Promise<void> {
    await this.clickElement(this.menuButton, 'Header Menu Button');
  }

  public async clickCart(): Promise<void> {
    await this.clickElement(this.cartButton, 'Header Shopping Cart');
  }

  public async getCartCount(): Promise<number> {
    const isVisible = await this.isElementVisible(this.cartBadge, 2000);
    if (!isVisible) return 0;
    const countStr = await this.getElementText(this.cartBadge, 'Shopping Cart Badge');
    return parseInt(countStr, 10) || 0;
  }
}
