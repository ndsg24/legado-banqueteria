import type { Recipe } from '@legado/domain/operations/recipes'
export type RecipesResponseDto = Record<string, Pick<Recipe, 'dishId' | 'revision' | 'lines'>>
