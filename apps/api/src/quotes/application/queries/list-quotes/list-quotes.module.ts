import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { ListQuotesHandler } from './list-quotes.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [ListQuotesHandler],
  exports: [ListQuotesHandler],
})
export class ListQuotesModule {}
