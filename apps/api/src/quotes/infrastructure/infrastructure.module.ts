import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { AdaptersModule } from './adapters/adapters.module'
import { IntakeController } from './web/http/controllers/intake.controller'
import { HistoryController } from './web/http/controllers/history.controller'

@Module({
  imports: [CqrsModule, AdaptersModule],
  controllers: [IntakeController, HistoryController],
  exports: [AdaptersModule],
})
export class InfrastructureModule {}
