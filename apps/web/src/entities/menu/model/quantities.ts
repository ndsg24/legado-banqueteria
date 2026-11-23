import { normalizedQuantity, menuItems, type Quantities } from '@legado/domain/menu/quantities'

const key = 'legado-quote-selection'

export function readQuantities(params?: URLSearchParams): Quantities {
  if (params?.has('plato')) {
    const result: Quantities = {}
    for (const item of params.getAll('plato')) {
      const [id, count = '1'] = item.split(':')
      const qty = Number(count)
      if (menuItems.has(id) && Number.isSafeInteger(qty) && qty > 0)
        result[id] = normalizedQuantity(id, qty)
    }
    return result
  }
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(key) ?? '{}')
    if (!saved || typeof saved !== 'object') return {}
    const entries = Array.isArray(saved) ? saved.map((id) => [id, 1]) : Object.entries(saved)
    return Object.fromEntries(
      entries
        .filter(([id, qty]) => menuItems.has(id) && Number.isSafeInteger(qty) && qty > 0)
        .map(([id, qty]) => [id, normalizedQuantity(id, qty)]),
    )
  } catch {
    return {}
  }
}

export function saveQuantities(counts: Quantities) {
  try {
    sessionStorage.setItem(key, JSON.stringify(counts))
  } catch {
    /* Direct links carry the selection too. */
  }
}

export function writeSelectionParams(params: URLSearchParams, counts: Quantities) {
  params.delete('plato')
  for (const [id, quantity] of Object.entries(counts)) {
    params.append('plato', quantity === 1 ? id : id + ':' + quantity)
  }
}
