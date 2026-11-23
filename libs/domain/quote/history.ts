import type { QuoteRequest } from './request'

export const quoteStatuses = ['requested', 'confirmed', 'cancelled'] as const
export type QuoteStatus = (typeof quoteStatuses)[number]
export type QuoteStatusFilter = QuoteStatus | 'active'

export type QuoteSummary = Pick<QuoteRequest, 'event' | 'date' | 'location'> & {
  number: string
  status: QuoteStatus
  guests: string
}
export type QuotePage = {
  items: QuoteSummary[]
  nextCursor: string | null
  total: number
  page: number
  pageSize: number
}
export type QuoteDetail = {
  number: string
  status: QuoteStatus
  payload: QuoteRequest
  dateBookedByAnotherEvent?: boolean
}

export const quoteSortFields = ['event', 'number', 'location', 'date', 'guests'] as const
export type QuoteSort = (typeof quoteSortFields)[number]
export type CalendarDay = {
  event: QuoteRequest['event']
  date: string
  count: number
  guests: number
}
