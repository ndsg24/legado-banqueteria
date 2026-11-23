import {
  toApiQuote,
  type ApiCalendarDay,
  type ApiQuotePage,
  type ApiQuoteDetail,
} from '@legado/domain/quote/wire'
import type { CalendarDay, QuoteDetail, QuotePage } from '@legado/domain/quote/history'

import { eventDateUnavailableCode } from '@legado/domain/quote/availability'
import { ConflictException, NotFoundException } from '@nestjs/common'
import type { ChangeStatusResult } from '../../domain/ports/output/quote-writer.port'

export class HistoryPresenter {
  static statusChange(result: ChangeStatusResult): void {
    if (result === 'date-unavailable')
      throw new ConflictException({
        statusCode: 409,
        error: 'Conflict',
        code: eventDateUnavailableCode,
        message: 'Another event is already confirmed for this date.',
      })
    if (result === 'conflict') throw new ConflictException('Quote status has changed.')
    if (result === 'missing') throw new NotFoundException('Unknown or expired quote.')
  }

  static calendar(days: CalendarDay[]): ApiCalendarDay[] {
    return days.map(({ date, event, count, guests }) => toApiQuote({ date, event, count, guests }))
  }

  static page(page: QuotePage): ApiQuotePage {
    return { ...page, items: page.items.map(toApiQuote) }
  }
  static detail(quote: QuoteDetail): ApiQuoteDetail {
    return {
      number: quote.number,
      status: quote.status,
      payload: toApiQuote(quote.payload),
      dateBookedByAnotherEvent: quote.dateBookedByAnotherEvent,
    }
  }
}
