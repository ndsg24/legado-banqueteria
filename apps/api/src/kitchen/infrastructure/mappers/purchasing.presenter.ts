import type { PurchaseReport } from '@legado/domain/operations/purchasing'
import type { PurchasingResponseDto } from '../web/http/dtos/responses/purchasing.response.dto'

export class PurchasingPresenter {
  static report({ events, lines, guests }: PurchaseReport): PurchasingResponseDto {
    return { events, lines, guests }
  }
}
