import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { ReceiveQuoteHandler } from './receive-quote.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [ReceiveQuoteHandler],
  exports: [ReceiveQuoteHandler],
})
export class ReceiveQuoteModule {}
