import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { QuoteAvailabilityHandler } from './quote-availability.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [QuoteAvailabilityHandler],
  exports: [QuoteAvailabilityHandler],
})
export class QuoteAvailabilityModule {}
