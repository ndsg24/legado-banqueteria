import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { GetQuoteHandler } from './get-quote.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [GetQuoteHandler],
  exports: [GetQuoteHandler],
})
export class GetQuoteModule {}
