/**
 * Generic retry and polling utilities.
 */
export class WaitUtils {
  /**
   * Pauses execution for a designated duration (use sparingly; prefer Playwright web-first assertions).
   */
  public static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Polls an asynchronous condition until it returns true or times out.
   */
  public static async waitUntil(
    condition: () => Promise<boolean>,
    options: {
      timeoutMs?: number;
      intervalMs?: number;
      timeoutMessage?: string;
    } = {},
  ): Promise<void> {
    const timeout = options.timeoutMs ?? 10000;
    const interval = options.intervalMs ?? 250;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        if (await condition()) {
          return;
        }
      } catch {
        // Condition evaluation threw; keep waiting until timeout
      }
      await this.sleep(interval);
    }

    throw new Error(options.timeoutMessage ?? `Condition was not satisfied within ${timeout}ms`);
  }

  /**
   * Retries an async action up to a given number of attempts.
   */
  public static async retry<T>(
    action: () => Promise<T>,
    retries = 3,
    delayMs = 1000,
    backoffMultiplier = 1.5,
  ): Promise<T> {
    let lastError: unknown;
    let currentDelay = delayMs;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await action();
      } catch (err) {
        lastError = err;
        if (attempt === retries) break;
        await this.sleep(currentDelay);
        currentDelay *= backoffMultiplier;
      }
    }

    throw lastError;
  }
}
