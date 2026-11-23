import type { QuoteRequest } from '@legado/domain/quote/request'

import type { QuoteStatus } from '@legado/domain/quote/history'

export type ChangeStatusResult = 'saved' | 'conflict' | 'date-unavailable' | 'missing'
export type ReceiveQuoteResult = 'accepted' | 'conflict' | 'date-unavailable'
export const QUOTE_WRITER = Symbol('QUOTE_WRITER')
export interface QuoteWriter {
  changeStatus(
    number: string,
    expected: QuoteStatus,
    status: QuoteStatus,
  ): Promise<ChangeStatusResult>
  accept(id: string, quote: QuoteRequest): Promise<ReceiveQuoteResult>
}
