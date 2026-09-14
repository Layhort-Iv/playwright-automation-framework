import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/base.page';

/**
 * Enterprise Modal / Dialog Component Object.
 */
export class ModalComponent extends BasePage {
  constructor(
    page: Page,
    public readonly modalRoot: Locator,
  ) {
    super(page);
  }

  public get title(): Locator {
    return this.modalRoot.locator('.modal-title, [role="heading"], h2, h3');
  }

  public get body(): Locator {
    return this.modalRoot.locator('.modal-body, p');
  }

  public get confirmButton(): Locator {
    return this.modalRoot.locator(
      'button:has-text("Confirm"), button:has-text("OK"), button.btn-primary',
    );
  }

  public get cancelButton(): Locator {
    return this.modalRoot.locator(
      'button:has-text("Cancel"), button:has-text("Close"), button.btn-secondary',
    );
  }

  public async isDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.modalRoot, 3000);
  }

  public async getModalTitle(): Promise<string> {
    return await this.getElementText(this.title, 'Modal Title');
  }

  public async clickConfirm(): Promise<void> {
    await this.clickElement(this.confirmButton, 'Modal Confirm Button');
  }

  public async clickCancel(): Promise<void> {
    await this.clickElement(this.cancelButton, 'Modal Cancel Button');
  }
}
