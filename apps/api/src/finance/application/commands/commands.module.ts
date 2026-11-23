import { Module } from '@nestjs/common'
import { RecordMovementModule } from './record-movement/record-movement.module'

@Module({
  imports: [RecordMovementModule],
  exports: [RecordMovementModule],
})
export class CommandsModule {}
