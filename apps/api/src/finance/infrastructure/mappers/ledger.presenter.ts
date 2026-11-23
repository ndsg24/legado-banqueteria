import { ConflictException, NotFoundException } from '@nestjs/common'
import type { MovementOutcome } from '../../domain/ports/output/ledger.port'
import type { LedgerPage } from '@legado/domain/operations/finance'
import type { LedgerResponseDto } from '../web/http/dtos/responses/ledger.response.dto'

export class LedgerPresenter {
  static movementResult(outcome: MovementOutcome): void {
    switch (outcome) {
      case 'saved':
        return
      case 'unknown-quote':
        throw new NotFoundException('Quote does not exist.')
      case 'conflict':
        throw new ConflictException('Movement ID already in use.')
      default:
        return outcome satisfies never
    }
  }

  static page(page: LedgerPage): LedgerResponseDto {
    const {
      total,
      page: current,
      pageSize,
      sales,
      profit,
      expenses,
      income,
      balance,
      breakdown,
      items,
    } = page
    return {
      total,
      page: current,
      pageSize,
      sales,
      profit,
      expenses,
      income,
      balance,
      breakdown,
      items: items.map(({ id, category, date, amount, quoteNumber, quoteAvailable }) => ({
        id,
        category,
        date,
        amount,
        quoteNumber,
        quoteAvailable,
      })),
    }
  }
}
