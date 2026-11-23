import { BadRequestException } from '@nestjs/common'
import { recipeSchema } from '../web/http/dtos/requests/recipes.request.dto'
import { SaveRecipeCommand } from '../../application/commands/save-recipe/save-recipe.command'

export class RecipesMapper {
  static toSaveRecipeCommand(body: unknown): SaveRecipeCommand {
    const parsed = recipeSchema.safeParse(body)
    if (!parsed.success) throw new BadRequestException('Invalid dish, ingredients or quantities.')
    return new SaveRecipeCommand(parsed.data)
  }
}
