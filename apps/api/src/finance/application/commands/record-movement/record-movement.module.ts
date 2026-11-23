import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { RecordMovementHandler } from './record-movement.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [RecordMovementHandler],
  exports: [RecordMovementHandler],
})
export class RecordMovementModule {}
