import { Module } from '@nestjs/common'
import { ReadLedgerModule } from './read-ledger/read-ledger.module'

@Module({
  imports: [ReadLedgerModule],
  exports: [ReadLedgerModule],
})
export class QueriesModule {}
