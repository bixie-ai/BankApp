/**
 * Formats an ISO date string into a human-readable date using the Intl API.
 * @param dateString - An ISO 8601 date string to parse
 * @param options - Intl.DateTimeFormatOptions controlling which parts of the date to display
 * @param locale - BCP 47 locale tag for localization (defaults to 'en-US')
 * @returns A formatted date string, e.g. "Jan 15, 2024"
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' },
  locale: string = 'en-US',
): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale, options).format(date)
}

/**
 * Formats an ISO date string into a human-readable date-and-time string including hours and minutes.
 * @param dateString - An ISO 8601 date string to parse
 * @param locale - BCP 47 locale tag for localization (defaults to 'en-US')
 * @returns A formatted date-time string, e.g. "Jan 15, 2024, 02:30 PM"
 */
export function formatDateTime(dateString: string, locale: string = 'en-US'): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
