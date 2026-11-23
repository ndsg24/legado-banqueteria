import { BadRequestException } from '@nestjs/common'
import { ledgerFilters, movementSchema } from '../web/http/dtos/requests/ledger.request.dto'
import { ReadLedgerQuery } from '../../application/queries/read-ledger/read-ledger.query'
import { RecordMovementCommand } from '../../application/commands/record-movement/record-movement.command'

export class LedgerMapper {
  static toReadLedgerQuery(query: unknown): ReadLedgerQuery {
    const parsed = ledgerFilters.safeParse(query)
    if (!parsed.success) throw new BadRequestException('Invalid ledger filters.')
    return new ReadLedgerQuery(parsed.data)
  }

  static toRecordMovementCommand(body: unknown): RecordMovementCommand {
    const parsed = movementSchema.safeParse(body)
    if (!parsed.success) throw new BadRequestException('Invalid movement.')
    return new RecordMovementCommand(parsed.data)
  }
}
