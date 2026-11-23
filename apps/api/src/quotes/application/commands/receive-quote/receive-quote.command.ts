import { Command } from '@nestjs/cqrs'
import type { QuoteRequest } from '@legado/domain/quote/request'
import type { ReceiveQuoteResult } from '../../../domain/ports/output/quote-writer.port'

export class ReceiveQuoteCommand extends Command<ReceiveQuoteResult | 'invalid-pilot-contact'> {
  constructor(
    readonly id: string,
    readonly quote: QuoteRequest,
  ) {
    super()
  }
}
