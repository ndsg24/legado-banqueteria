import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { ReadLedgerHandler } from './read-ledger.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [ReadLedgerHandler],
  exports: [ReadLedgerHandler],
})
export class ReadLedgerModule {}
