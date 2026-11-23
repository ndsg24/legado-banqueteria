import type { QuoteRequest } from './request'
import type { CalendarDay, QuoteDetail, QuotePage, QuoteSummary } from './history'

export const eventCodes = {
  Matrimonio: 'wedding',
  'Encuentro familiar': 'family-gathering',
  'Evento de empresa': 'corporate-event',
  'Otra celebración': 'other-celebration',
} as const satisfies Record<QuoteRequest['event'], string>

type EventCode = (typeof eventCodes)[QuoteRequest['event']]
export type ApiQuote = Omit<QuoteRequest, 'event'> & { event: EventCode }
export type ApiSummary = Omit<QuoteSummary, 'event'> & { event: EventCode }
export type ApiQuotePage = Omit<QuotePage, 'items'> & { items: ApiSummary[] }
export type ApiCalendarDay = Omit<CalendarDay, 'event'> & { event: EventCode }
export type ApiQuoteDetail = Omit<QuoteDetail, 'payload'> & { payload: ApiQuote }

const events = new Map<string, QuoteRequest['event']>(
  (Object.keys(eventCodes) as QuoteRequest['event'][]).map((event) => [eventCodes[event], event]),
)

export function toApiQuote<T extends { event: QuoteRequest['event'] }>(quote: T) {
  return { ...quote, event: eventCodes[quote.event] } as Omit<T, 'event'> & { event: EventCode }
}

export function fromApiQuote<T extends { event: EventCode }>(quote: T) {
  const event = events.get(quote.event)
  if (!event) throw new Error('Unknown event code')
  return { ...quote, event } as Omit<T, 'event'> & { event: QuoteRequest['event'] }
}

// Convert the wire enum before the existing domain schema validates the entire request.
export function decodeQuoteInput(value: unknown) {
  if (!value || typeof value !== 'object' || !('event' in value)) return value
  return { ...value, event: typeof value.event === 'string' ? events.get(value.event) : undefined }
}
