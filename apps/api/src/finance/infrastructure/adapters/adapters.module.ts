import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../../shared'
import { Ledger } from '../../domain/ports/output/ledger.port'
import { PostgresLedger } from './ledger.postgres'

@Module({
  imports: [DatabaseModule],
  providers: [{ provide: Ledger, useClass: PostgresLedger }],
  exports: [Ledger],
})
export class AdaptersModule {}
