export const mobilePrefix = '+569'

// Also recognize the formats used in earlier drafts and by phone address books.
export function localMobileDigits(value: string): string | null {
  const compact = value.replace(/[\s()-]/g, '')
  if (compact.startsWith(mobilePrefix)) {
    const local = compact.slice(mobilePrefix.length)
    return /^\d{0,8}$/.test(local) ? local : null
  }
  if (/^(?:56)?9\d{8}$/.test(compact)) return compact.slice(-8)
  return /^\d{0,8}$/.test(compact) ? compact : null
}
