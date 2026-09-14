import { FrameworkError } from './framework.error';

/**
 * Error thrown during API execution failures or HTTP status assertions.
 */
export class ApiRequestError extends FrameworkError {
  constructor(
    public readonly method: string,
    public readonly endpoint: string,
    public readonly statusCode?: number,
    public readonly responseBody?: unknown,
    originalError?: Error,
  ) {
    const msg = `API Request failed: [${method.toUpperCase()}] ${endpoint} | Status: ${
      statusCode ?? 'N/A'
    } | Detail: ${originalError?.message || JSON.stringify(responseBody)}`;
    super(msg, { method, endpoint, statusCode, responseBody });
  }
}
