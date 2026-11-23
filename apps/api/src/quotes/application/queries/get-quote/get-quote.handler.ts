import { Inject } from '@nestjs/common'
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs'
import { GetQuoteQuery } from './get-quote.query'
import { GetQuoteUseCase } from '../../use-cases/get-quote.use-case'
import { QUOTE_READER, type QuoteReader } from '../../../domain/ports/output/quote-reader.port'

@QueryHandler(GetQuoteQuery)
export class GetQuoteHandler implements IQueryHandler<GetQuoteQuery> {
  private readonly useCase: GetQuoteUseCase
  constructor(@Inject(QUOTE_READER) repository: QuoteReader) {
    this.useCase = new GetQuoteUseCase(repository)
  }
  execute(message: GetQuoteQuery) {
    return this.useCase.execute(message)
  }
}
