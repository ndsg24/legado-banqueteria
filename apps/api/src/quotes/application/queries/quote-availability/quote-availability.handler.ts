import { Inject } from '@nestjs/common'
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs'
import { QuoteAvailabilityQuery } from './quote-availability.query'
import { QuoteAvailabilityUseCase } from '../../use-cases/quote-availability.use-case'
import { QUOTE_READER, type QuoteReader } from '../../../domain/ports/output/quote-reader.port'

@QueryHandler(QuoteAvailabilityQuery)
export class QuoteAvailabilityHandler implements IQueryHandler<QuoteAvailabilityQuery> {
  private readonly useCase: QuoteAvailabilityUseCase
  constructor(@Inject(QUOTE_READER) repository: QuoteReader) {
    this.useCase = new QuoteAvailabilityUseCase(repository)
  }
  execute() {
    return this.useCase.execute()
  }
}
