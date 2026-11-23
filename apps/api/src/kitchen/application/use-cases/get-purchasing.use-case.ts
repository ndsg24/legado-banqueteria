import { purchaseReport } from '@legado/domain/operations/purchasing'
import type { KitchenRecipes } from '../../domain/ports/output/recipes.port'
import type { ProductionOrders } from '../../domain/ports/output/production-orders.port'

export class GetPurchasingUseCase {
  constructor(
    private readonly orders: ProductionOrders,
    private readonly recipes: KitchenRecipes,
  ) {}
  async execute(from: string, to: string) {
    const [events, book] = await Promise.all([this.orders.confirmed(from, to), this.recipes.read()])
    return purchaseReport(events, book)
  }
}
