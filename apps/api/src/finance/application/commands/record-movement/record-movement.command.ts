import { Command } from '@nestjs/cqrs'
import type { Movement } from '@legado/domain/operations/finance'
import type { MovementOutcome } from '../../../domain/ports/output/ledger.port'

export class RecordMovementCommand extends Command<MovementOutcome> {
  constructor(readonly entry: Movement) {
    super()
  }
}
