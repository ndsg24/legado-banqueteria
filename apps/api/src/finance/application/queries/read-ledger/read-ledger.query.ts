import { Query } from '@nestjs/cqrs'
import type { LedgerPage, LedgerFilters } from '@legado/domain/operations/finance'

export class ReadLedgerQuery extends Query<LedgerPage> {
  constructor(readonly filters: LedgerFilters) {
    super()
  }
}
