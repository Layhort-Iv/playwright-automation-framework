import { IAuthStrategy } from './auth-strategy.interface';

export interface ApiKeyOptions {
  keyName?: string;
  in?: 'header' | 'query';
}

/**
 * API Key Authentication Strategy (in Header or Query Param).
 */
export class ApiKeyAuthStrategy implements IAuthStrategy {
  private readonly keyName: string;
  private readonly location: 'header' | 'query';

  constructor(
    private readonly apiKey: string,
    options: ApiKeyOptions = {},
  ) {
    this.keyName = options.keyName || 'x-api-key';
    this.location = options.in || 'header';
  }

  public async apply(
    headers: Record<string, string>,
    params: Record<string, string> = {},
  ): Promise<{ headers: Record<string, string>; params?: Record<string, string> }> {
    if (this.location === 'header') {
      return {
        headers: {
          ...headers,
          [this.keyName]: this.apiKey,
        },
        params,
      };
    }

    return {
      headers,
      params: {
        ...params,
        [this.keyName]: this.apiKey,
      },
    };
  }
}
