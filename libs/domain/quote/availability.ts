import { z } from 'zod'

export const quoteAvailabilityPath = '/api/v1/quotes/availability'
export const eventDateUnavailableCode = 'EVENT_DATE_UNAVAILABLE'
export const quoteAvailabilitySchema = z.strictObject({
  unavailableDates: z.array(z.iso.date()).max(367),
})
export type QuoteAvailability = z.infer<typeof quoteAvailabilitySchema>
