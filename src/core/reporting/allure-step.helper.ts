import * as allure from 'allure-js-commons';
import { test } from '@playwright/test';

/**
 * Enterprise Reporting Utility for enriching Playwright & Allure reports.
 */
export class ReportHelper {
  /**
   * Executes a named step in Playwright and Allure simultaneously.
   */
  public static async step<T>(stepName: string, action: () => Promise<T>): Promise<T> {
    return await test.step(stepName, async () => {
      try {
        if (process.env.GENERATE_ALLURE === 'true') {
          return await allure.step(stepName, action);
        }
        return await action();
      } catch (error) {
        throw error;
      }
    });
  }

  /**
   * Attaches JSON data to reports.
   */
  public static async attachJson(name: string, data: unknown): Promise<void> {
    const formatted = JSON.stringify(data, null, 2);
    await test.info().attach(name, {
      body: formatted,
      contentType: 'application/json',
    });

    if (process.env.GENERATE_ALLURE === 'true') {
      await allure.attachment(name, formatted, 'application/json');
    }
  }

  /**
   * Attaches text/logs to reports.
   */
  public static async attachText(name: string, content: string): Promise<void> {
    await test.info().attach(name, {
      body: content,
      contentType: 'text/plain',
    });

    if (process.env.GENERATE_ALLURE === 'true') {
      await allure.attachment(name, content, 'text/plain');
    }
  }

  /**
   * Sets Allure metadata tags.
   */
  public static setAllureMetadata(options: {
    epic?: string;
    feature?: string;
    story?: string;
    severity?: 'trivial' | 'minor' | 'normal' | 'critical' | 'blocker';
    issue?: string;
  }): void {
    if (process.env.GENERATE_ALLURE !== 'true') return;

    if (options.epic) allure.epic(options.epic);
    if (options.feature) allure.feature(options.feature);
    if (options.story) allure.story(options.story);
    if (options.severity) allure.severity(options.severity);
    if (options.issue) allure.issue(options.issue, options.issue);
  }
}
