import type { MessageKey } from '../i18n/messages'
import type { RecipeLine } from './recipes'

type Unit = RecipeLine['unit']
type Pack = { size: number; count: number }

// Illustrative purchase formats in g, ml or units. Each set is descending and
// uses multiples of its smallest format so the minimum purchase is attainable.
const defaultFormats: Record<Unit, readonly number[]> = {
  g: [2000, 1000, 500, 250],
  ml: [2000, 1000, 500, 250],
  unit: [1],
}

const ingredientFormats: Record<string, Partial<Record<Unit, readonly number[]>>> = {
  avocado: { unit: [6, 1] },
  butter: { g: [1000, 500, 250, 125] },
  coffee: { g: [1000, 500, 250] },
  cocoa: { g: [500, 250, 50] },
  'condensed-milk': { g: [397] },
  cream: { ml: [1000, 500, 250] },
  curry: { g: [200, 100, 50] },
  egg: { unit: [30, 12, 6, 1] },
  garlic: { g: [500, 250, 50] },
  lemon: { unit: [6, 1] },
  mascarpone: { g: [1000, 500, 250] },
  milk: { ml: [1000, 500] },
  mint: { g: [100, 50, 25] },
  oil: { ml: [5000, 1000, 500, 250] },
  olive: { unit: [1] },
  parsley: { g: [100, 50, 25] },
  pisco: { ml: [750] },
  salt: { g: [1000, 500, 250] },
  'sparkling-wine': { ml: [750] },
  stock: { ml: [1000, 500, 250] },
  sugar: { g: [2000, 1000, 500] },
}

const beverageFormats: Record<string, readonly number[]> = {
  'menu.dishes.bar-5.name': [330],
  'menu.dishes.bar-8.name': [750],
  'menu.dishes.bajativos-1.name': [700],
}

function* combinations(total: number, sizes: readonly number[], index = 0): Generator<Pack[]> {
  const size = sizes[index]
  if (total === 0) {
    yield []
    return
  }
  if (index === sizes.length - 1) {
    yield [{ size, count: total / size }]
    return
  }
  for (let count = Math.floor(total / size); count >= 0; count--) {
    for (const rest of combinations(total - count * size, sizes, index + 1)) {
      yield count > 0 ? [{ size, count }, ...rest] : rest
    }
  }
}

export function purchasePackOptions(name: MessageKey, unit: Unit, amount: number) {
  const ingredient = name.slice('menu.ingredients.'.length)
  const sizes =
    (unit === 'ml' ? beverageFormats[name] : undefined) ??
    ingredientFormats[ingredient]?.[unit] ??
    defaultFormats[unit]
  const smallest = sizes[sizes.length - 1]
  // Ignore floating-point noise when aggregated recipe quantities land on a pack boundary.
  const tolerance = 4 * Number.EPSILON * Math.max(1, amount)
  const total = Math.max(1, Math.ceil((amount - tolerance) / smallest)) * smallest
  if (!Number.isSafeInteger(total) || amount <= 0) return null

  const surplus = total - amount > tolerance ? total - amount : 0
  return { total, surplus, combinations: combinations(total, sizes) }
}
