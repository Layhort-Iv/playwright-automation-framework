/**
 * String manipulation and formatting helpers.
 */
export class StringUtils {
  /**
   * Generates a random alphanumeric string.
   */
  public static randomString(length = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Capitalizes the first letter of each word.
   */
  public static toTitleCase(input: string): string {
    return input.replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );
  }

  /**
   * Truncates a string to max length with ellipsis.
   */
  public static truncate(input: string, maxLength = 100): string {
    if (input.length <= maxLength) return input;
    return `${input.substring(0, maxLength)}...`;
  }
}
