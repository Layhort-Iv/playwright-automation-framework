import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/base.page';

/**
 * Shared Pagination Widget.
 */
export class PaginationWidget extends BasePage {
  constructor(
    page: Page,
    public readonly paginationRoot: Locator,
  ) {
    super(page);
  }

  public get nextButton(): Locator {
    return this.paginationRoot.locator('button:has-text("Next"), [aria-label="Next"]');
  }

  public get prevButton(): Locator {
    return this.paginationRoot.locator('button:has-text("Previous"), [aria-label="Previous"]');
  }

  public async goToNextPage(): Promise<void> {
    await this.clickElement(this.nextButton, 'Pagination Next Button');
  }

  public async goToPrevPage(): Promise<void> {
    await this.clickElement(this.prevButton, 'Pagination Previous Button');
  }

  public async selectPageNumber(pageNumber: number): Promise<void> {
    const pageButton = this.paginationRoot.locator(
      `button:has-text("${pageNumber}"), a:has-text("${pageNumber}")`,
    );
    await this.clickElement(pageButton, `Page number ${pageNumber}`);
  }
}
