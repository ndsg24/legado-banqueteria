import { eventDateRange } from '@legado/domain/quote/dates'
import type { QuoteReader } from '../../domain/ports/output/quote-reader.port'

export class QuoteAvailabilityUseCase {
  constructor(private readonly repository: QuoteReader) {}
  execute() {
    const { first, last } = eventDateRange()
    return this.repository.unavailableDates(first.toString(), last.toString())
  }
}
