import type { Translate } from '../i18n/messages'
import { quoteCategories } from './catalog'
import type { Quantities } from './quantities'
import type { IngredientKey } from './types'

export type IngredientOmissions = Record<string, string[]>
const ingredientsByDish = new Map(
  quoteCategories.flatMap(({ items }) => items.map((item) => [item.id, item.ingredients] as const)),
)

function isIngredientOf(dish: string, key: string): key is IngredientKey {
  return !!ingredientsByDish.get(dish)?.some((ingredient) => ingredient === key)
}

export function validOmissions(items: Quantities, omissions: IngredientOmissions) {
  return Object.entries(omissions).every(
    ([id, keys]) =>
      items[id] > 0 &&
      new Set(keys).size === keys.length &&
      keys.every((key) => isIngredientOf(id, key)),
  )
}

export function omissionLabel(
  id: string,
  omissions: IngredientOmissions | undefined,
  t: Translate,
) {
  const names = ingredientsByDish
    .get(id)
    ?.filter((key) => omissions?.[id]?.includes(key))
    .map((key) => t(key))
  return names?.length ? t('quote.selection.without', { ingredients: names.join(', ') }) : ''
}

export function readOmissions(params: URLSearchParams, items: Quantities) {
  const result: IngredientOmissions = {}
  for (const pair of params.getAll('sin')) {
    const [dish, slug] = pair.split(':')
    const key = 'menu.ingredients.' + slug
    if (!items[dish] || !isIngredientOf(dish, key)) continue
    const keys = (result[dish] ??= [])
    if (!keys.includes(key)) keys.push(key)
  }
  return result
}

export function writeOmissions(params: URLSearchParams, omissions: IngredientOmissions) {
  params.delete('sin')
  for (const [id, keys] of Object.entries(omissions))
    for (const key of keys) params.append('sin', id + ':' + key.replace('menu.ingredients.', ''))
}
