import type { Recipe, RecipeBook } from '@legado/domain/operations/recipes'
export abstract class KitchenRecipes {
  abstract read(): Promise<RecipeBook>
  abstract save(recipe: Recipe): Promise<boolean>
}
