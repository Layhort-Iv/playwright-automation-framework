import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { HeaderLayout } from '../layouts/header.layout';
import { FooterLayout } from '../layouts/footer.layout';
import { ScopedLogger, logger } from '../../core/logging';

export interface CheckoutCustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * Checkout Flow Page Object.
 */
export class CheckoutPage extends BasePage {
  public readonly header: HeaderLayout;
  public readonly footer: FooterLayout;

  // Step 1: Customer Information
  public readonly firstNameInput: Locator;
  public readonly lastNameInput: Locator;
  public readonly postalCodeInput: Locator;
  public readonly continueButton: Locator;
  public readonly cancelButton: Locator;
  public readonly errorMessage: Locator;

  // Step 2: Overview
  public readonly finishButton: Locator;
  public readonly summarySubtotal: Locator;
  public readonly summaryTax: Locator;
  public readonly summaryTotal: Locator;

  // Step 3: Complete
  public readonly completeHeader: Locator;
  public readonly backHomeButton: Locator;

  constructor(page: Page, pageLogger: ScopedLogger = logger) {
    super(page, pageLogger);
    this.header = new HeaderLayout(page);
    this.footer = new FooterLayout(page);

    this.firstNameInput = page.locator('[data-test="firstName"], #first-name');
    this.lastNameInput = page.locator('[data-test="lastName"], #last-name');
    this.postalCodeInput = page.locator('[data-test="postalCode"], #postal-code');
    this.continueButton = page.locator('[data-test="continue"], #continue');
    this.cancelButton = page.locator('[data-test="cancel"], #cancel');
    this.errorMessage = page.locator('[data-test="error"], .error-message-container');

    this.finishButton = page.locator('[data-test="finish"], #finish');
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.summaryTotal = page.locator('.summary_total_label');

    this.completeHeader = page.locator('.complete-header');
    this.backHomeButton = page.locator('[data-test="back-to-products"], #back-to-products');
  }

  public async fillInformation(info: CheckoutCustomerInfo): Promise<void> {
    await this.fillInput(this.firstNameInput, info.firstName, 'Checkout First Name');
    await this.fillInput(this.lastNameInput, info.lastName, 'Checkout Last Name');
    await this.fillInput(this.postalCodeInput, info.postalCode, 'Checkout Postal Code');
    await this.clickElement(this.continueButton, 'Checkout Continue Button');
  }

  public async clickFinish(): Promise<void> {
    await this.clickElement(this.finishButton, 'Checkout Finish Button');
  }

  public async getOrderConfirmationMessage(): Promise<string> {
    await expect(this.completeHeader).toBeVisible();
    return await this.getElementText(this.completeHeader, 'Order Complete Header');
  }
}
