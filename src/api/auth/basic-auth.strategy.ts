import { IAuthStrategy } from './auth-strategy.interface';

/**
 * HTTP Basic Authentication Strategy.
 */
export class BasicAuthStrategy implements IAuthStrategy {
  constructor(
    private readonly username: string,
    private readonly password: string,
  ) {}

  public async apply(
    headers: Record<string, string>,
    params?: Record<string, string>,
  ): Promise<{ headers: Record<string, string>; params?: Record<string, string> }> {
    const encoded = Buffer.from(`${this.username}:${this.password}`).toString('base64');
    return {
      headers: {
        ...headers,
        Authorization: `Basic ${encoded}`,
      },
      params,
    };
  }
}
