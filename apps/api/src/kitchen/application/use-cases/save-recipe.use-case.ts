import type { KitchenRecipes } from '../../domain/ports/output/recipes.port'
import type { SaveRecipeCommand } from '../commands/save-recipe/save-recipe.command'

export class SaveRecipeUseCase {
  constructor(private readonly repository: KitchenRecipes) {}
  execute(message: SaveRecipeCommand) {
    return this.repository.save(message.recipe)
  }
}
