import { Query } from '@nestjs/cqrs'

export class QuoteAvailabilityQuery extends Query<string[]> {}
