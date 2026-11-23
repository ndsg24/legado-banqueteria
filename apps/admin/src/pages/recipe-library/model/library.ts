import { catalogCategories } from '@legado/domain/menu/catalog'
import { referenceRecipe } from '@legado/domain/operations/preparation'
import type { RecipeBook } from '@legado/domain/operations/recipes'

export const libraryDishes = catalogCategories.flatMap((category) =>
  category.items.map((dish) => ({ ...dish, group: category.label })),
)
export type LibraryDish = (typeof libraryDishes)[number]
export const recipeKinds = ['custom', 'reference', 'missing'] as const
export type RecipeKind = (typeof recipeKinds)[number]

export function recipeKind(dishId: string, book: RecipeBook): RecipeKind {
  if (book[dishId]) return 'custom'
  return referenceRecipe(dishId).length ? 'reference' : 'missing'
}

export function searchTerm(value: string) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').trim().toLowerCase()
}

export const libraryLabels = {
  es: { index: 'Platos y salsas', back: 'Volver al índice' },
  en: { index: 'Dishes and sauces', back: 'Back to the index' },
  fr: { index: 'Plats et sauces', back: 'Revenir à l’index' },
  pt: { index: 'Pratos e molhos', back: 'Voltar ao índice' },
}
