import type { QuoteReader } from '../../domain/ports/output/quote-reader.port'
import type { GetQuoteQuery } from '../queries/get-quote/get-quote.query'

export class GetQuoteUseCase {
  constructor(private readonly repository: QuoteReader) {}
  execute(message: GetQuoteQuery) {
    return this.repository.detail(message.number)
  }
}
