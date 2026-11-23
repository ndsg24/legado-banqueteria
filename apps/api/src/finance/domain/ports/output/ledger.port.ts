import type { LedgerFilters, LedgerPage, Movement } from '@legado/domain/operations/finance'

export type MovementOutcome = 'saved' | 'conflict' | 'unknown-quote'
export type LedgerSlice = Pick<LedgerPage, 'items' | 'total' | 'page' | 'pageSize' | 'breakdown'>
export abstract class Ledger {
  abstract record(entry: Movement): Promise<MovementOutcome>
  abstract list(filters: LedgerFilters): Promise<LedgerSlice>
}
