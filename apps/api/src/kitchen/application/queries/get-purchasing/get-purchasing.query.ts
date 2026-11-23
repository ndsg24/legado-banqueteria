import { Query } from '@nestjs/cqrs'
import type { PurchaseReport } from '@legado/domain/operations/purchasing'

export class GetPurchasingQuery extends Query<PurchaseReport> {
  constructor(
    readonly from: string,
    readonly to: string,
  ) {
    super()
  }
}
