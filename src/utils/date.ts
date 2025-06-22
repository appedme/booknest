/**
 * Utility functions for safe date handling
 */

/**
 * Safely converts various date formats to a Date object
 * @param dateValue - The date value to convert (string, number, Date, or undefined)
 * @returns A valid Date object or the current date as fallback
 */
export function safeDate(dateValue: string | number | Date | undefined | null): Date {
  try {
    if (!dateValue) {
      return new Date();
    }
    
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    
    if (typeof dateValue === 'number') {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    
    if (dateValue && typeof dateValue === 'object' && 'getTime' in dateValue) {
      return dateValue as Date;
    }
    
    return new Date();
  } catch {
    return new Date();
  }
}

/**
 * Safely converts a date to ISO string
 * @param dateValue - The date value to convert
 * @returns ISO string representation of the date
 */
export function safeDateToISOString(dateValue: string | number | Date | undefined | null): string {
  return safeDate(dateValue).toISOString();
}

/**
 * Safely formats a date to locale string
 * @param dateValue - The date value to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function safeDateToLocaleString(
  dateValue: string | number | Date | undefined | null,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    return safeDate(dateValue).toLocaleDateString(locale, options);
  } catch {
    return 'Unknown';
  }
}
