import { APIRequestContext } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse, HttpMethod } from '../../common/types';
import { ApiRequestError } from '../../common/errors/api.error';
import { IAuthStrategy } from '../auth/auth-strategy.interface';
import { ScopedLogger, logger } from '../../core/logging';
import { ReportHelper } from '../../core/reporting';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  timeout?: number;
  authStrategy?: IAuthStrategy;
}

/**
 * Enterprise Base API Client wrapping Playwright's APIRequestContext.
 * Implements correlation ID injection, structured request/response logging,
 * pluggable auth strategies, and standardized response envelopes.
 */
export class BaseApiClient {
  private authStrategy?: IAuthStrategy;

  constructor(
    protected readonly requestContext: APIRequestContext,
    protected readonly baseUrl: string,
    protected readonly clientLogger: ScopedLogger = logger,
  ) {}

  public setAuthStrategy(authStrategy: IAuthStrategy): this {
    this.authStrategy = authStrategy;
    return this;
  }

  public async get<T = unknown>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('GET', endpoint, options);
  }

  public async post<T = unknown>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('POST', endpoint, options);
  }

  public async put<T = unknown>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('PUT', endpoint, options);
  }

  public async patch<T = unknown>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('PATCH', endpoint, options);
  }

  public async delete<T = unknown>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('DELETE', endpoint, options);
  }

  private async executeRequest<T>(
    method: HttpMethod,
    endpoint: string,
    options: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const correlationId = uuidv4();
    const fullUrl = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Correlation-ID': correlationId,
      ...(options.headers || {}),
    };

    let params: Record<string, string> | undefined = undefined;
    if (options.params) {
      params = Object.entries(options.params).reduce(
        (acc, [k, v]) => ({ ...acc, [k]: String(v) }),
        {} as Record<string, string>,
      );
    }

    // Apply Authentication Strategy if configured
    const activeAuth = options.authStrategy || this.authStrategy;
    if (activeAuth) {
      const authResult = await activeAuth.apply(headers, params);
      headers = authResult.headers;
      params = authResult.params;
    }

    const stepTitle = `API [${method}] ${endpoint}`;

    return await ReportHelper.step(stepTitle, async () => {
      this.clientLogger.logRequest(method, fullUrl, headers, options.data);
      const startTime = Date.now();

      try {
        const response = await this.requestContext.fetch(fullUrl, {
          method,
          headers,
          params,
          data: options.data,
          timeout: options.timeout,
        });

        const durationMs = Date.now() - startTime;
        let responseBody: T;

        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('application/json')) {
          try {
            responseBody = (await response.json()) as T;
          } catch {
            responseBody = (await response.text()) as unknown as T;
          }
        } else {
          responseBody = (await response.text()) as unknown as T;
        }

        this.clientLogger.logResponse(method, fullUrl, response.status(), durationMs, responseBody);

        const apiResponse: ApiResponse<T> = {
          status: response.status(),
          statusText: response.statusText(),
          headers: response.headers(),
          body: responseBody,
          durationMs,
          url: fullUrl,
          correlationId,
        };

        await ReportHelper.attachJson(`API Response: ${method} ${endpoint}`, {
          url: fullUrl,
          status: response.status(),
          durationMs,
          correlationId,
          headers: response.headers(),
          body: responseBody,
        });

        return apiResponse;
      } catch (error) {
        const durationMs = Date.now() - startTime;
        this.clientLogger.error(
          `Request execution failed: [${method}] ${fullUrl} (${durationMs}ms)`,
          error,
          { correlationId },
        );
        throw new ApiRequestError(method, fullUrl, undefined, undefined, error as Error);
      }
    });
  }
}
