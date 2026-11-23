import type { ReceiveQuoteCommand } from '../commands/receive-quote/receive-quote.command'
import type { QuoteWriter } from '../../domain/ports/output/quote-writer.port'

export class ReceiveQuoteUseCase {
  constructor(private readonly writer: QuoteWriter) {}
  async execute({ id, quote }: ReceiveQuoteCommand) {
    if (
      !quote.email.toLowerCase().endsWith('@example.test') ||
      quote.phone ||
      quote.notes ||
      quote.dietaryNeeds
    )
      return 'invalid-pilot-contact' as const
    return this.writer.accept(id, quote)
  }
}
