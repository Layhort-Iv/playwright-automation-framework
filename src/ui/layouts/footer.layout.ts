import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';

/**
 * Footer Layout Object.
 */
export class FooterLayout extends BasePage {
  public readonly container: Locator;
  public readonly twitterLink: Locator;
  public readonly facebookLink: Locator;
  public readonly linkedinLink: Locator;
  public readonly copyrightText: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page.locator('.footer');
    this.twitterLink = page.locator('a[href*="twitter"]');
    this.facebookLink = page.locator('a[href*="facebook"]');
    this.linkedinLink = page.locator('a[href*="linkedin"]');
    this.copyrightText = page.locator('.footer_copy');
  }

  public async getCopyright(): Promise<string> {
    return await this.getElementText(this.copyrightText, 'Footer Copyright Text');
  }
}
