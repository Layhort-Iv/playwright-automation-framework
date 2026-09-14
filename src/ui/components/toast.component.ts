import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/base.page';

/**
 * Enterprise Toast Notification Component Object.
 */
export class ToastComponent extends BasePage {
  constructor(
    page: Page,
    public readonly toastRoot: Locator = page.locator('.toast, [role="alert"], .notification'),
  ) {
    super(page);
  }

  public async getMessage(): Promise<string> {
    return await this.getElementText(this.toastRoot, 'Toast Notification Message');
  }

  public async isDisplayed(timeoutMs = 5000): Promise<boolean> {
    return await this.isElementVisible(this.toastRoot, timeoutMs);
  }

  public async dismiss(): Promise<void> {
    const closeBtn = this.toastRoot.locator('button.close, [aria-label="Close"]');
    if (await this.isElementVisible(closeBtn, 1000)) {
      await this.clickElement(closeBtn, 'Toast Close Button');
    }
  }
}
