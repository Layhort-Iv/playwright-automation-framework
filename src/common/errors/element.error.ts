import { FrameworkError } from './framework.error';

/**
 * Error thrown when a UI element interaction or wait condition fails.
 */
export class ElementInteractionError extends FrameworkError {
  constructor(
    public readonly locatorDescription: string,
    public readonly action: string,
    public readonly originalError?: Error,
    timeoutMs?: number,
  ) {
    const msg = `Failed to perform '${action}' on element [${locatorDescription}]${
      timeoutMs ? ` within ${timeoutMs}ms` : ''
    }: ${originalError?.message || 'Element condition not satisfied'}`;
    super(msg, { locatorDescription, action, timeoutMs });
  }
}
