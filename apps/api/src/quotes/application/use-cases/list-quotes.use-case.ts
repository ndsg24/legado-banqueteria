import type { ListQuotesQuery } from '../queries/list-quotes/list-quotes.query'
import type { QuoteReader } from '../../domain/ports/output/quote-reader.port'

export class ListQuotesUseCase {
  constructor(private readonly reader: QuoteReader) {}
  async execute({ filters }: ListQuotesQuery) {
    const { page, pageSize } = filters
    const { rows: items, total } = await this.reader.history(filters)
    const nextCursor =
      (!filters.sort || filters.sort === 'number') &&
      filters.direction !== 'asc' &&
      items.length &&
      page * pageSize < total
        ? items[items.length - 1].number
        : null
    return { items, total, page, pageSize, nextCursor }
  }
}
