import type { QuoteReader } from '../../domain/ports/output/quote-reader.port'
import type { QuoteCalendarQuery } from '../queries/quote-calendar/quote-calendar.query'

export class QuoteCalendarUseCase {
  constructor(private readonly repository: QuoteReader) {}
  execute(message: QuoteCalendarQuery) {
    return this.repository.calendar(message.month, message.status)
  }
}
