import { fromApiQuote } from '@legado/domain/quote/wire'
import type { HistoryFilter } from '../../domain/ports/output/quote-reader.port'
import { QuoteCalendarQuery } from '../../application/queries/quote-calendar/quote-calendar.query'
import { BadRequestException } from '@nestjs/common'
import { ChangeQuoteStatusCommand } from '../../application/commands/change-quote-status/change-quote-status.command'
import {
  changeStatusRequest,
  quoteNumber,
  type CalendarRequest,
  type HistoryRequest,
} from '../web/http/dtos/requests/history.request.dto'

export class HistoryMapper {
  static toChangeStatusCommand(number: string, body: unknown) {
    const data = changeStatusRequest.safeParse(body)
    if (!quoteNumber.safeParse(number).success || !data.success)
      throw new BadRequestException('Invalid quote number or status change.')
    return new ChangeQuoteStatusCommand(number, data.data.expectedStatus, data.data.status)
  }

  static toCalendarQuery(input: CalendarRequest) {
    return new QuoteCalendarQuery(input.month, input.status)
  }

  static toHistoryFilter(input: HistoryRequest): HistoryFilter {
    return { ...input, event: input.event ? fromApiQuote({ event: input.event }).event : undefined }
  }
}
