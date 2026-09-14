import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';

/**
 * Sidebar Navigation Layout Object.
 */
export class SidebarLayout extends BasePage {
  public readonly allItemsLink: Locator;
  public readonly aboutLink: Locator;
  public readonly logoutLink: Locator;
  public readonly resetAppStateLink: Locator;
  public readonly closeMenuButton: Locator;

  constructor(page: Page) {
    super(page);
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
  }

  public async clickLogout(): Promise<void> {
    await this.clickElement(this.logoutLink, 'Sidebar Logout Link');
  }

  public async clickAllItems(): Promise<void> {
    await this.clickElement(this.allItemsLink, 'Sidebar All Items Link');
  }

  public async closeMenu(): Promise<void> {
    await this.clickElement(this.closeMenuButton, 'Sidebar Close Button');
  }
}
