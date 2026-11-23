import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { ChangeQuoteStatusHandler } from './change-quote-status.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [ChangeQuoteStatusHandler],
  exports: [ChangeQuoteStatusHandler],
})
export class ChangeQuoteStatusModule {}
