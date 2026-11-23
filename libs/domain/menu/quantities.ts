import { quoteCategories } from './catalog'

export const menuItems = new Map(
  quoteCategories.flatMap((category) =>
    category.items.map((item) => [item.id, item.name] as const),
  ),
)
const singleChoices = new Set(
  quoteCategories
    .filter((category) => category.collection !== 'cocktail')
    .flatMap((category) => category.items.map((item) => item.id)),
)

export function isSingleChoice(id: string) {
  return singleChoices.has(id)
}

export function normalizedQuantity(id: string, quantity: number) {
  return isSingleChoice(id) ? Math.min(1, quantity) : quantity
}
export type Quantities = Record<string, number>

const maxChoicesByCategory: Readonly<Record<string, number>> = {
  aperitivos: 2,
  principales: 2,
  guarniciones: 2,
  postres: 1,
  nocturnos: 1,
}
const courseLimits = quoteCategories
  .filter(({ id }) => id in maxChoicesByCategory)
  .map((category) => ({
    category,
    max: maxChoicesByCategory[category.id],
    ids: new Set(category.items.filter((item) => !item.refreshment).map((item) => item.id)),
  }))

export function courseChoiceCounts(items: Quantities) {
  return courseLimits.map((limit) => ({
    ...limit,
    count: Array.from(limit.ids).filter((id) => items[id] > 0).length,
  }))
}

export function courseLimitReached(id: string, counts: ReturnType<typeof courseChoiceCounts>) {
  return counts.some((limit) => limit.count >= limit.max && limit.ids.has(id))
}

export function withQuantity(current: Quantities, id: string, quantity: number): Quantities {
  if (!menuItems.has(id) || !Number.isSafeInteger(quantity) || quantity < 0) return current
  if (quantity > 0 && !current[id] && courseLimitReached(id, courseChoiceCounts(current)))
    return current
  const next = { ...current }
  if (quantity === 0) delete next[id]
  else next[id] = normalizedQuantity(id, quantity)
  return next
}
