import type {
  QuoteDetail,
  QuoteSummary,
  QuoteSort,
  QuoteStatusFilter,
  CalendarDay,
} from '@legado/domain/quote/history'
import type { QuoteRequest } from '@legado/domain/quote/request'

export type HistoryFilter = {
  status?: QuoteStatusFilter
  page: number
  pageSize: number
  sort?: QuoteSort
  direction?: 'asc' | 'desc'
  from?: string
  to?: string
  before?: string
  search?: string
  event?: QuoteRequest['event']
}
export type HistoryResult = { rows: QuoteSummary[]; total: number }
export const QUOTE_READER = Symbol('QUOTE_READER')
export interface QuoteReader {
  unavailableDates(first: string, last: string): Promise<string[]>
  history(filters: HistoryFilter): Promise<HistoryResult>
  calendar(month: string, status: QuoteStatusFilter): Promise<CalendarDay[]>
  detail(number: string): Promise<QuoteDetail | undefined>
}
