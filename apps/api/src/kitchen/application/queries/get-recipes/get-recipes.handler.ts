import { Inject } from '@nestjs/common'
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs'
import { GetRecipesQuery } from './get-recipes.query'
import { GetRecipesUseCase } from '../../use-cases/get-recipes.use-case'
import { KitchenRecipes } from '../../../domain/ports/output/recipes.port'

@QueryHandler(GetRecipesQuery)
export class GetRecipesHandler implements IQueryHandler<GetRecipesQuery> {
  private readonly useCase: GetRecipesUseCase
  constructor(@Inject(KitchenRecipes) repository: KitchenRecipes) {
    this.useCase = new GetRecipesUseCase(repository)
  }
  execute() {
    return this.useCase.execute()
  }
}
