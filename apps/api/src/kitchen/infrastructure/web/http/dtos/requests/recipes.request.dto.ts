import { recipeSchema } from '@legado/domain/operations/recipes'
import type { z } from 'zod'
export { recipeSchema }
export type SaveRecipeRequestDto = z.input<typeof recipeSchema>
