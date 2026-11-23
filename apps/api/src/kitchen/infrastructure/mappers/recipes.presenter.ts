import { ConflictException } from '@nestjs/common'
import type { RecipeBook } from '@legado/domain/operations/recipes'
import type { RecipesResponseDto } from '../web/http/dtos/responses/recipes.response.dto'

export class RecipesPresenter {
  static saveResult(saved: boolean): void {
    if (!saved) throw new ConflictException('Recipe revision has changed.')
  }

  static book(book: RecipeBook): RecipesResponseDto {
    return Object.fromEntries(
      Object.entries(book).map(([key, { dishId, revision, lines }]) => [
        key,
        {
          dishId,
          revision,
          lines: lines.map(({ ingredient, amount, unit }) => ({ ingredient, amount, unit })),
        },
      ]),
    )
  }
}
