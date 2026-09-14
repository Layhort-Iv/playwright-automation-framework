import { FrameworkError } from './framework.error';

/**
 * Error thrown when a payload fails runtime schema validation.
 */
export class SchemaValidationError extends FrameworkError {
  constructor(
    public readonly schemaName: string,
    public readonly validationErrors: unknown,
    public readonly targetPayload?: unknown,
  ) {
    const errorDetails = JSON.stringify(validationErrors, null, 2);
    const msg = `Payload failed schema validation for [${schemaName}]:\n${errorDetails}`;
    super(msg, { schemaName, validationErrors, targetPayload });
  }
}
