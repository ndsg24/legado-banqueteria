import { Command } from '@nestjs/cqrs'
import type { QuoteStatus } from '@legado/domain/quote/history'
import type { ChangeStatusResult } from '../../../domain/ports/output/quote-writer.port'

export class ChangeQuoteStatusCommand extends Command<ChangeStatusResult> {
  constructor(
    readonly number: string,
    readonly expectedStatus: QuoteStatus,
    readonly status: QuoteStatus,
  ) {
    super()
  }
}
