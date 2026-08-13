/**
 * Formats a numeric amount as a locale-aware currency string using the Intl API.
 * @param amount - The raw numeric value to format
 * @param currency - ISO 4217 currency code (defaults to 'USD')
 * @param locale - BCP 47 locale tag controlling grouping and decimal separators (defaults to 'en-US')
 * @returns A formatted currency string, e.g. "$1,234.56"
 */
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}
