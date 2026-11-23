import { Inject } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { RecordMovementCommand } from './record-movement.command'
import { RecordMovementUseCase } from '../../use-cases/record-movement.use-case'
import { Ledger } from '../../../domain/ports/output/ledger.port'

@CommandHandler(RecordMovementCommand)
export class RecordMovementHandler implements ICommandHandler<RecordMovementCommand> {
  private readonly useCase: RecordMovementUseCase
  constructor(@Inject(Ledger) repository: Ledger) {
    this.useCase = new RecordMovementUseCase(repository)
  }
  execute(message: RecordMovementCommand) {
    return this.useCase.execute(message)
  }
}
