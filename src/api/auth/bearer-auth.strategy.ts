import { IAuthStrategy } from './auth-strategy.interface';

/**
 * Bearer Token Authentication Strategy.
 */
export class BearerAuthStrategy implements IAuthStrategy {
  constructor(private readonly token: string) {}

  public async apply(
    headers: Record<string, string>,
    params?: Record<string, string>,
  ): Promise<{ headers: Record<string, string>; params?: Record<string, string> }> {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${this.token}`,
      },
      params,
    };
  }
}
