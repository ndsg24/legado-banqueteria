import type { Ledger } from '../../domain/ports/output/ledger.port'
import type { ReadLedgerQuery } from '../queries/read-ledger/read-ledger.query'
import { summarizeLedger } from '@legado/domain/operations/finance'

export class ReadLedgerUseCase {
  constructor(private readonly repository: Ledger) {}
  async execute(message: ReadLedgerQuery) {
    const page = await this.repository.list(message.filters)
    return { ...page, ...summarizeLedger(page.breakdown) }
  }
}
