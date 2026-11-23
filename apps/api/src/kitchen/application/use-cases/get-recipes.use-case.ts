import type { KitchenRecipes } from '../../domain/ports/output/recipes.port'

export class GetRecipesUseCase {
  constructor(private readonly repository: KitchenRecipes) {}
  execute() {
    return this.repository.read()
  }
}
