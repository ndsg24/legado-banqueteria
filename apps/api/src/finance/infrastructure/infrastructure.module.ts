import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { AdaptersModule } from './adapters/adapters.module'
import { LedgerController } from './web/http/controllers/ledger.controller'

@Module({
  imports: [CqrsModule, AdaptersModule],
  controllers: [LedgerController],
  exports: [AdaptersModule],
})
export class InfrastructureModule {}
