import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { GetRecipesHandler } from './get-recipes.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [GetRecipesHandler],
  exports: [GetRecipesHandler],
})
export class GetRecipesModule {}
