export function formatRelativeDate(isoString: string) {
  const date = new Date(isoString)
  const now = Date.now()
  const diffMs = date.getTime() - now
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const rtf = new Intl.RelativeTimeFormat('ru', { numeric: 'auto' })

  if (Math.abs(diffMs) < hour) {
    return rtf.format(Math.round(diffMs / minute), 'minute')
  }

  if (Math.abs(diffMs) < day) {
    return rtf.format(Math.round(diffMs / hour), 'hour')
  }

  return rtf.format(Math.round(diffMs / day), 'day')
}
