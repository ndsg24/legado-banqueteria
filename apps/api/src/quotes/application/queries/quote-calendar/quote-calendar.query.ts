import { Query } from '@nestjs/cqrs'
import type { CalendarDay, QuoteStatusFilter } from '@legado/domain/quote/history'

export class QuoteCalendarQuery extends Query<CalendarDay[]> {
  constructor(
    readonly month: string,
    readonly status: QuoteStatusFilter,
  ) {
    super()
  }
}
