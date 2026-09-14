import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/base.page';

/**
 * Shared Dropdown Widget (supporting native select and custom DIV/UL dropdowns).
 */
export class DropdownWidget extends BasePage {
  constructor(
    page: Page,
    public readonly root: Locator,
  ) {
    super(page);
  }

  public async selectByValue(value: string): Promise<void> {
    const tagName = await this.root.evaluate(el => el.tagName.toLowerCase());
    if (tagName === 'select') {
      await this.selectDropdownOption(this.root, value, `Select Dropdown: ${value}`);
    } else {
      await this.clickElement(this.root, 'Dropdown Trigger');
      const option = this.page.locator(
        `[role="option"]:has-text("${value}"), li:has-text("${value}")`,
      );
      await this.clickElement(option, `Dropdown Option: ${value}`);
    }
  }

  public async getSelectedOptionText(): Promise<string> {
    const tagName = await this.root.evaluate(el => el.tagName.toLowerCase());
    if (tagName === 'select') {
      return await this.root.locator('option:checked').innerText();
    }
    return await this.getElementText(this.root, 'Custom Dropdown Selected Value');
  }
}
