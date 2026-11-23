import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { SaveRecipeHandler } from './save-recipe.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [SaveRecipeHandler],
  exports: [SaveRecipeHandler],
})
export class SaveRecipeModule {}
