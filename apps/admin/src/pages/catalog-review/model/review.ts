import type { Translate } from '@legado/brand/i18n'
import { catalogCategories } from '@legado/domain/menu/catalog'
import type { CatalogCategory, CatalogItem } from '@legado/domain/menu/types'
import { catalogPhoto } from '../../../shared/config/catalog-photo'

export const reviewFields = ['photo', 'description', 'ingredients'] as const
export type ReviewField = (typeof reviewFields)[number]
export type ReviewFilter = 'all' | 'pending' | 'complete' | ReviewField
export const deviceWidths = { desktop: 1680, ipad: 834, phone: 390 } as const
export type PreviewDevice = keyof typeof deviceWidths
export type PreviewDish = { category: CatalogCategory; item: CatalogItem }
export function collectionDishes(
  selected: CatalogCategory,
  singleCategory: boolean,
): PreviewDish[] {
  const categories = singleCategory
    ? [selected]
    : catalogCategories.filter((category) => category.collection === selected.collection)
  return categories.flatMap((category) => category.items.map((item) => ({ item, category })))
}

export function reviewCatalog(t: Translate) {
  return catalogCategories.flatMap((category) =>
    category.items.map((dish) => {
      const photo = catalogPhoto(dish.imageThumbnail)
      const description = t(dish.description)?.trim()
      const ingredients = (dish.ingredients ?? []).map((key) => t(key)).filter(Boolean)
      const available = {
        photo: Boolean(photo),
        description: Boolean(description),
        ingredients: ingredients.length > 0,
      }
      const missing = reviewFields.filter((key) => !available[key])
      return {
        item: dish,
        catalogCategory: category,
        id: dish.id,
        name: t(dish.name),
        category: category.id,
        group: t(category.label),
        photo,
        ingredients,
        description,
        missing,
      }
    }),
  )
}
export type ReviewRow = ReturnType<typeof reviewCatalog>[number]
export function matchesFilter(row: ReviewRow, filter: ReviewFilter) {
  if (filter === 'pending') return row.missing.length > 0
  if (filter === 'complete') return row.missing.length === 0
  return filter === 'all' || row.missing.includes(filter)
}
export function searchText(value: string) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').trim().toLowerCase()
}
export function publicCategoryUrl(category: string) {
  const url = new URL('https://ndsg24.github.io/legado-banqueteria/carta.html')
  url.searchParams.set('categoria', category)
  return url.href
}
