import type { ProductionOrder } from '@legado/domain/operations/purchasing'

export abstract class ProductionOrders {
  abstract confirmed(from: string, to: string): Promise<ProductionOrder[]>
}
