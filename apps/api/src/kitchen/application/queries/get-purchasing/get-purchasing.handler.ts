import { Inject } from '@nestjs/common'
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs'
import { GetPurchasingQuery } from './get-purchasing.query'
import { GetPurchasingUseCase } from '../../use-cases/get-purchasing.use-case'
import { KitchenRecipes } from '../../../domain/ports/output/recipes.port'
import { ProductionOrders } from '../../../domain/ports/output/production-orders.port'

@QueryHandler(GetPurchasingQuery)
export class GetPurchasingHandler implements IQueryHandler<GetPurchasingQuery> {
  private readonly useCase: GetPurchasingUseCase
  constructor(
    @Inject(ProductionOrders) orders: ProductionOrders,
    @Inject(KitchenRecipes) recipes: KitchenRecipes,
  ) {
    this.useCase = new GetPurchasingUseCase(orders, recipes)
  }
  execute({ from, to }: GetPurchasingQuery) {
    return this.useCase.execute(from, to)
  }
}
