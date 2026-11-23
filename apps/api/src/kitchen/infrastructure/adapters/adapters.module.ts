import { PostgresProductionOrders } from './production-orders.postgres'
import { ProductionOrders } from '../../domain/ports/output/production-orders.port'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../../shared'
import { KitchenRecipes } from '../../domain/ports/output/recipes.port'
import { PostgresRecipes } from './recipes.postgres'

@Module({
  imports: [DatabaseModule],
  providers: [
    { provide: ProductionOrders, useClass: PostgresProductionOrders },
    { provide: KitchenRecipes, useClass: PostgresRecipes },
  ],
  exports: [KitchenRecipes, ProductionOrders],
})
export class AdaptersModule {}
