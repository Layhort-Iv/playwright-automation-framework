import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/base.page';

/**
 * Enterprise Table Component Object.
 * Encapsulates table interactions (row count, header lookup, cell value extraction).
 */
export class TableComponent extends BasePage {
  constructor(
    page: Page,
    public readonly tableRoot: Locator,
  ) {
    super(page);
  }

  public get headers(): Locator {
    return this.tableRoot.locator('th');
  }

  public get rows(): Locator {
    return this.tableRoot.locator('tbody tr');
  }

  public async getRowCount(): Promise<number> {
    return await this.rows.count();
  }

  public async getRowCells(rowIndex: number): Promise<string[]> {
    const row = this.rows.nth(rowIndex);
    const cells = row.locator('td');
    const count = await cells.count();
    const values: string[] = [];

    for (let i = 0; i < count; i++) {
      values.push((await cells.nth(i).innerText()).trim());
    }
    return values;
  }

  public async getCellValue(rowIndex: number, colIndex: number): Promise<string> {
    const cell = this.rows.nth(rowIndex).locator('td').nth(colIndex);
    return await this.getElementText(cell, `Cell [${rowIndex}, ${colIndex}]`);
  }
}
