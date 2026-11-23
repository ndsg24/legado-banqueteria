import type { QuoteWriter } from '../../domain/ports/output/quote-writer.port'
import type { ChangeQuoteStatusCommand } from '../commands/change-quote-status/change-quote-status.command'

export class ChangeQuoteStatusUseCase {
  constructor(private readonly writer: QuoteWriter) {}
  execute({ number, expectedStatus, status }: ChangeQuoteStatusCommand) {
    return this.writer.changeStatus(number, expectedStatus, status)
  }
}
