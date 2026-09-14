import { RequestOptions } from '../client/base-api.client';
import { IAuthStrategy } from '../auth/auth-strategy.interface';

/**
 * Fluent Request Builder pattern for constructing API requests.
 */
export class RequestBuilder {
  private options: RequestOptions = {
    headers: {},
    params: {},
  };

  public static create(): RequestBuilder {
    return new RequestBuilder();
  }

  public withHeader(key: string, value: string): this {
    this.options.headers = {
      ...(this.options.headers || {}),
      [key]: value,
    };
    return this;
  }

  public withHeaders(headers: Record<string, string>): this {
    this.options.headers = {
      ...(this.options.headers || {}),
      ...headers,
    };
    return this;
  }

  public withParam(key: string, value: string | number | boolean): this {
    this.options.params = {
      ...(this.options.params || {}),
      [key]: value,
    };
    return this;
  }

  public withParams(params: Record<string, string | number | boolean>): this {
    this.options.params = {
      ...(this.options.params || {}),
      ...params,
    };
    return this;
  }

  public withBody<T>(body: T): this {
    this.options.data = body;
    return this;
  }

  public withTimeout(timeoutMs: number): this {
    this.options.timeout = timeoutMs;
    return this;
  }

  public withAuth(strategy: IAuthStrategy): this {
    this.options.authStrategy = strategy;
    return this;
  }

  public build(): RequestOptions {
    return { ...this.options };
  }
}
