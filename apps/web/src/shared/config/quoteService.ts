import { quoteAvailabilityPath } from '@legado/domain/quote/availability'
import { isQuotePilot } from './site'

export const quoteEndpoint = isQuotePilot
  ? 'http://127.0.0.1:3000/api/v1/quotes'
  : import.meta.env.VITE_QUOTE_ENDPOINT?.trim()

export const availabilityEndpoint =
  import.meta.env.VITE_QUOTE_AVAILABILITY_ENDPOINT?.trim() ||
  (quoteEndpoint ? new URL(quoteAvailabilityPath, quoteEndpoint).href : quoteAvailabilityPath)
