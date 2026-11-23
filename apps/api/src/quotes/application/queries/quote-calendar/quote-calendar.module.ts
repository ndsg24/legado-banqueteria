import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { QuoteCalendarHandler } from './quote-calendar.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [QuoteCalendarHandler],
  exports: [QuoteCalendarHandler],
})
export class QuoteCalendarModule {}
