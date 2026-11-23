import { movementSchema, ledgerFilters } from '@legado/domain/operations/finance'
import type { z } from 'zod'
export { movementSchema, ledgerFilters }
export type RecordMovementRequestDto = z.input<typeof movementSchema>
export type LedgerQueryDto = z.input<typeof ledgerFilters>
