import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { config } from '../../core/config';
import { UserCredentials } from '../../common/types';
import { ScopedLogger, logger } from '../../core/logging';

/**
 * Page Object for Application Login.
 */
export class LoginPage extends BasePage {
  public readonly usernameInput: Locator;
  public readonly passwordInput: Locator;
  public readonly loginButton: Locator;
  public readonly errorMessage: Locator;

  constructor(page: Page, pageLogger: ScopedLogger = logger) {
    super(page, pageLogger);
    this.usernameInput = page.locator('[data-test="username"], #user-name');
    this.passwordInput = page.locator('[data-test="password"], #password');
    this.loginButton = page.locator('[data-test="login-button"], #login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  public async navigate(): Promise<void> {
    await this.navigateTo(config.BASE_URL);
    await this.waitForPageLoaded();
  }

  public async waitForPageLoaded(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
  }

  public async login(credentials: UserCredentials): Promise<void> {
    await this.fillInput(this.usernameInput, credentials.username, 'Username input');
    await this.fillInput(this.passwordInput, credentials.password, 'Password input', true);
    await this.clickElement(this.loginButton, 'Login button');
  }

  public async getErrorMessageText(): Promise<string> {
    return await this.getElementText(this.errorMessage, 'Login error message');
  }

  public async isErrorVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }
}
