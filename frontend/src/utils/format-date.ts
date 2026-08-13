export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' },
  locale: string = 'en-US',
): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale, options).format(date)
}

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
