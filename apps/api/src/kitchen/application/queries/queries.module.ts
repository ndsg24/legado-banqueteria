import { GetPurchasingModule } from './get-purchasing/get-purchasing.module'
import { Module } from '@nestjs/common'
import { GetRecipesModule } from './get-recipes/get-recipes.module'

@Module({
  imports: [GetRecipesModule, GetPurchasingModule],
  exports: [GetRecipesModule, GetPurchasingModule],
})
export class QueriesModule {}
