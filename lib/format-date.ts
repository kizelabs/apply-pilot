/**
 * Format a date to dd-mm-yyyy
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

/**
 * Format a date to short format (e.g., "14 May")
 */
export function formatDateShort(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}
