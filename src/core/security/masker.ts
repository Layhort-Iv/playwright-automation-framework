/**
 * Enterprise Masker for Redacting Sensitive Data from Logs and Reports.
 */
export class DataMasker {
  private static readonly SENSITIVE_KEYS = new Set([
    'password',
    'pass',
    'secret',
    'token',
    'accesstoken',
    'auth',
    'authorization',
    'apikey',
    'api_key',
    'client_secret',
    'creditcard',
    'cvv',
    'ssn',
  ]);

  private static readonly MASK_REPLACEMENT = '***REDACTED***';

  /**
   * Recursively sanitizes an object or array, replacing sensitive field values with a mask.
   */
  public static maskObject<T>(data: T): T {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.maskObject(item)) as unknown as T;
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase().replace(/[-_]/g, '');

      if (this.SENSITIVE_KEYS.has(lowerKey)) {
        sanitized[key] = this.MASK_REPLACEMENT;
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.maskObject(value);
      } else if (typeof value === 'string' && this.looksLikeBearerToken(value)) {
        sanitized[key] = 'Bearer ' + this.MASK_REPLACEMENT;
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized as T;
  }

  /**
   * Masks sensitive substrings within raw text (e.g. JSON strings, URLs with credentials).
   */
  public static maskString(text: string): string {
    if (!text || typeof text !== 'string') return text;

    let masked = text;

    // Mask Authorization: Bearer <token>
    masked = masked.replace(/Bearer\s+([A-Za-z0-9-_=.]+)/gi, `Bearer ${this.MASK_REPLACEMENT}`);

    // Mask basic auth URLs: https://user:pass@host
    masked = masked.replace(/:\/\/[^:]+:([^@]+)@/g, `://***:***@`);

    // Mask JSON password/token key-value pairs
    masked = masked.replace(
      /"(password|token|secret|apiKey|authorization)":\s*"[^"]+"/gi,
      `"$1": "${this.MASK_REPLACEMENT}"`,
    );

    return masked;
  }

  private static looksLikeBearerToken(val: string): boolean {
    return /^Bearer\s+[A-Za-z0-9-_=.]+$/i.test(val.trim());
  }
}
