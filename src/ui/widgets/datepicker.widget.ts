import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/base.page';

/**
 * Shared Datepicker Widget.
 */
export class DatepickerWidget extends BasePage {
  constructor(
    page: Page,
    public readonly inputLocator: Locator,
  ) {
    super(page);
  }

  public async setDate(dateString: string): Promise<void> {
    await this.fillInput(this.inputLocator, dateString, `Datepicker input: ${dateString}`);
    await this.inputLocator.press('Enter');
  }

  public async getValue(): Promise<string> {
    return await this.inputLocator.inputValue();
  }
}
