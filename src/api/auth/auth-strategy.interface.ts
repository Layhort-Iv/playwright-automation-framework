/**
 * Strategy interface for pluggable authentication mechanisms.
 * Allows transparent swapping of authentication types (Bearer, Basic, API Key, OAuth2)
 * without requiring any modifications to test specifications.
 */
export interface IAuthStrategy {
  /**
   * Applies authentication credentials to outgoing HTTP headers or query parameters.
   */
  apply(
    headers: Record<string, string>,
    params?: Record<string, string>,
  ): Promise<{
    headers: Record<string, string>;
    params?: Record<string, string>;
  }>;
}
