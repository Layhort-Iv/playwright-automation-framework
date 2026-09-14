import { config } from '../config';

/**
 * Enterprise Secret Manager providing centralized, audited access to secure credentials.
 */
export class SecretManager {
  /**
   * Retrieves an active credential, giving precedence to environment variables over defaults.
   */
  public static getSecret(key: string, fallback?: string): string {
    const value = process.env[key] || fallback;
    if (!value) {
      throw new Error(`[SecretManager] Required secret key '${key}' was not found in environment.`);
    }
    return value;
  }

  /**
   * Returns user credentials for the requested role.
   */
  public static getUserCredentials(role: 'admin' | 'standard' = 'standard') {
    if (role === 'admin') {
      return {
        username: config.ADMIN_USERNAME,
        password: config.ADMIN_PASSWORD,
        role: 'admin',
      };
    }

    return {
      username: config.STANDARD_USERNAME,
      password: config.STANDARD_PASSWORD,
      role: 'standard',
    };
  }
}
