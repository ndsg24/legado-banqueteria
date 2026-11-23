import { Inject } from '@nestjs/common'
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs'
import { ReadLedgerQuery } from './read-ledger.query'
import { ReadLedgerUseCase } from '../../use-cases/read-ledger.use-case'
import { Ledger } from '../../../domain/ports/output/ledger.port'

@QueryHandler(ReadLedgerQuery)
export class ReadLedgerHandler implements IQueryHandler<ReadLedgerQuery> {
  private readonly useCase: ReadLedgerUseCase
  constructor(@Inject(Ledger) repository: Ledger) {
    this.useCase = new ReadLedgerUseCase(repository)
  }
  execute(message: ReadLedgerQuery) {
    return this.useCase.execute(message)
  }
}
