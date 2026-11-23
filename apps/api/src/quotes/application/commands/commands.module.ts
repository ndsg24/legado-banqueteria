import { Module } from '@nestjs/common'
import { ChangeQuoteStatusModule } from './change-quote-status/change-quote-status.module'
import { ReceiveQuoteModule } from './receive-quote/receive-quote.module'

@Module({
  imports: [ReceiveQuoteModule, ChangeQuoteStatusModule],
  exports: [ReceiveQuoteModule, ChangeQuoteStatusModule],
})
export class CommandsModule {}
