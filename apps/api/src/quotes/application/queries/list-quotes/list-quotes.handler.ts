import { Inject } from '@nestjs/common'
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs'
import { ListQuotesQuery } from './list-quotes.query'
import { ListQuotesUseCase } from '../../use-cases/list-quotes.use-case'
import { QUOTE_READER, type QuoteReader } from '../../../domain/ports/output/quote-reader.port'

@QueryHandler(ListQuotesQuery)
export class ListQuotesHandler implements IQueryHandler<ListQuotesQuery> {
  private readonly useCase: ListQuotesUseCase
  constructor(@Inject(QUOTE_READER) repository: QuoteReader) {
    this.useCase = new ListQuotesUseCase(repository)
  }
  execute(message: ListQuotesQuery) {
    return this.useCase.execute(message)
  }
}
