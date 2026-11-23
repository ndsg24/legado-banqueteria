import { Query } from '@nestjs/cqrs'
import type { HistoryFilter } from '../../../domain/ports/output/quote-reader.port'
import type { QuotePage } from '@legado/domain/quote/history'

export class ListQuotesQuery extends Query<QuotePage> {
  constructor(readonly filters: HistoryFilter) {
    super()
  }
}
