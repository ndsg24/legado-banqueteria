import { PurchasingController } from './web/http/controllers/purchasing.controller'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { AdaptersModule } from './adapters/adapters.module'
import { RecipesController } from './web/http/controllers/recipes.controller'

@Module({
  imports: [CqrsModule, AdaptersModule],
  controllers: [RecipesController, PurchasingController],
  exports: [AdaptersModule],
})
export class InfrastructureModule {}
