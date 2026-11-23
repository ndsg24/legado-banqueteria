import type { Ledger } from '../../domain/ports/output/ledger.port'
import type { RecordMovementCommand } from '../commands/record-movement/record-movement.command'

export class RecordMovementUseCase {
  constructor(private readonly repository: Ledger) {}
  execute(message: RecordMovementCommand) {
    return this.repository.record(message.entry)
  }
}
