import type { LedgerPage } from '@legado/domain/operations/finance'

export type LedgerResponseDto = Pick<
  LedgerPage,
  | 'items'
  | 'breakdown'
  | 'total'
  | 'page'
  | 'pageSize'
  | 'sales'
  | 'expenses'
  | 'profit'
  | 'income'
  | 'balance'
>
