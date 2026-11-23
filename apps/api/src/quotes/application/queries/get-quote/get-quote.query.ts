import { Query } from '@nestjs/cqrs'
import type { QuoteDetail } from '@legado/domain/quote/history'

export class GetQuoteQuery extends Query<QuoteDetail | undefined> {
  constructor(readonly number: string) {
    super()
  }
}
