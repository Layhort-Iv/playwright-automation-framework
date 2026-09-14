/**
 * Date manipulation and formatting helpers.
 */
export class DateUtils {
  /**
   * Returns an ISO-formatted timestamp.
   */
  public static nowIso(): string {
    return new Date().toISOString();
  }

  /**
   * Formats a date as YYYY-MM-DD.
   */
  public static formatDateIso(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Adds specified days to a date.
   */
  public static addDays(days: number, fromDate: Date = new Date()): Date {
    const result = new Date(fromDate);
    result.setDate(result.getDate() + days);
    return result;
  }
}
