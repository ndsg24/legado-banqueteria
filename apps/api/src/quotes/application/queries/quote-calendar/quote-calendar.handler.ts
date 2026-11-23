import { Inject } from '@nestjs/common'
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs'
import { QuoteCalendarQuery } from './quote-calendar.query'
import { QuoteCalendarUseCase } from '../../use-cases/quote-calendar.use-case'
import { QUOTE_READER, type QuoteReader } from '../../../domain/ports/output/quote-reader.port'

@QueryHandler(QuoteCalendarQuery)
export class QuoteCalendarHandler implements IQueryHandler<QuoteCalendarQuery> {
  private readonly useCase: QuoteCalendarUseCase
  constructor(@Inject(QUOTE_READER) repository: QuoteReader) {
    this.useCase = new QuoteCalendarUseCase(repository)
  }
  execute(message: QuoteCalendarQuery) {
    return this.useCase.execute(message)
  }
}
