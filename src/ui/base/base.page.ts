import { Page, Locator } from '@playwright/test';
import { ElementInteractionError } from '../../common/errors/element.error';
import { Timeouts } from '../../common/constants/timeouts.constants';
import { ScopedLogger, logger } from '../../core/logging';
import { ReportHelper } from '../../core/reporting';

/**
 * Enterprise Base Page encapsulating Playwright Page operations.
 * Implements auto-waiting, contextual logging, resilient error handling,
 * and automated step reporting to Playwright and Allure.
 */
export abstract class BasePage {
  constructor(
    public readonly page: Page,
    protected readonly pageLogger: ScopedLogger = logger,
  ) {}

  /**
   * Navigates to a specific URL or path.
   */
  public async navigateTo(urlOrPath: string): Promise<void> {
    const stepName = `Navigate to ${urlOrPath}`;
    await ReportHelper.step(stepName, async () => {
      this.pageLogger.info(`Navigating to URL: ${urlOrPath}`);
      try {
        await this.page.goto(urlOrPath, {
          waitUntil: 'domcontentloaded',
          timeout: Timeouts.PAGE_LOAD,
        });
      } catch (error) {
        throw new ElementInteractionError(
          urlOrPath,
          'navigateTo',
          error as Error,
          Timeouts.PAGE_LOAD,
        );
      }
    });
  }

  /**
   * Robust click action with auto-wait and step logging.
   */
  public async clickElement(locator: Locator, description: string): Promise<void> {
    const stepName = `Click on [${description}]`;
    await ReportHelper.step(stepName, async () => {
      this.pageLogger.logStep(`Clicking: ${description}`);
      try {
        await locator.waitFor({ state: 'visible', timeout: Timeouts.DEFAULT });
        await locator.click({ timeout: Timeouts.SHORT });
      } catch (error) {
        await this.captureFailureScreenshot(`click_failed_${description}`);
        throw new ElementInteractionError(description, 'click', error as Error, Timeouts.DEFAULT);
      }
    });
  }

  /**
   * Robust fill input action with support for sensitive data masking in logs.
   */
  public async fillInput(
    locator: Locator,
    text: string,
    description: string,
    isMasked = false,
  ): Promise<void> {
    const logValue = isMasked ? '***REDACTED***' : text;
    const stepName = `Type "${logValue}" into [${description}]`;

    await ReportHelper.step(stepName, async () => {
      this.pageLogger.logStep(`Filling [${description}] with value: ${logValue}`);
      try {
        await locator.waitFor({ state: 'visible', timeout: Timeouts.DEFAULT });
        await locator.fill(text, { timeout: Timeouts.SHORT });
      } catch (error) {
        await this.captureFailureScreenshot(`fill_failed_${description}`);
        throw new ElementInteractionError(description, 'fill', error as Error, Timeouts.DEFAULT);
      }
    });
  }

  /**
   * Selects an option from a native dropdown by value or label.
   */
  public async selectDropdownOption(
    locator: Locator,
    valueOrLabel: string,
    description: string,
  ): Promise<void> {
    const stepName = `Select "${valueOrLabel}" from [${description}]`;
    await ReportHelper.step(stepName, async () => {
      this.pageLogger.logStep(`Selecting [${valueOrLabel}] in [${description}]`);
      try {
        await locator.waitFor({ state: 'visible', timeout: Timeouts.DEFAULT });
        await locator.selectOption(valueOrLabel);
      } catch (error) {
        throw new ElementInteractionError(
          description,
          'selectOption',
          error as Error,
          Timeouts.DEFAULT,
        );
      }
    });
  }

  /**
   * Gets trimmed text from a locator.
   */
  public async getElementText(locator: Locator, description = 'element'): Promise<string> {
    try {
      await locator.waitFor({ state: 'visible', timeout: Timeouts.DEFAULT });
      const text = await locator.innerText();
      return text.trim();
    } catch (error) {
      throw new ElementInteractionError(description, 'innerText', error as Error, Timeouts.DEFAULT);
    }
  }

  /**
   * Checks if an element is visible within a given timeout without throwing an unhandled exception.
   */
  public async isElementVisible(
    locator: Locator,
    timeoutMs: number = Timeouts.SHORT,
  ): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Captures an instant screenshot and attaches it to the active report.
   */
  public async captureScreenshot(name: string): Promise<Buffer> {
    const screenshotBuffer = await this.page.screenshot({ fullPage: true });
    await ReportHelper.attachText(`Screenshot: ${name}`, 'Full-page screenshot captured.');
    return screenshotBuffer;
  }

  protected async captureFailureScreenshot(name: string): Promise<void> {
    try {
      await this.captureScreenshot(name);
    } catch {
      // Ignore screenshot capture error during existing failure unwind
    }
  }

  public get currentUrl(): string {
    return this.page.url();
  }

  public async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
