import { quoteAvailabilityPath, quoteAvailabilitySchema } from '@legado/domain/quote/availability'

export async function readAvailability(bookingOrigin: string | undefined) {
  if (!bookingOrigin) throw new Error('Missing booking API origin')
  const origin = new URL(bookingOrigin)
  if (origin.protocol !== 'https:' || origin.href !== origin.origin + '/') {
    throw new Error('Invalid booking API origin')
  }

  const response = await fetch(new URL(quoteAvailabilityPath, origin), {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error('Booking API unavailable')
  return quoteAvailabilitySchema.parse(await response.json())
}
