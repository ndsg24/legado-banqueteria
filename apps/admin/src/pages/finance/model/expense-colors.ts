import type { Category } from '@legado/domain/operations/finance'

const colors: Partial<Record<Category, string>> = {
  supplies: 'var(--service-herb)',
  staff: 'var(--service-blue)',
  rentals: 'var(--service-wine)',
  transport: 'var(--service-citrus)',
  otherExpense: 'var(--gold)',
}

export function expenseColor(category: Category) {
  return colors[category] ?? ''
}
