import type { RecipeLine } from '@legado/domain/operations/recipes'

export function supplyQuantityFormatter(locale: string, unitLabel: string) {
  const format = new Intl.NumberFormat(locale, { maximumFractionDigits: 3 })
  return (amount: number, unit: RecipeLine['unit']) => {
    if (unit !== 'unit' && amount >= 1000) {
      return format.format(amount / 1000) + ' ' + (unit === 'g' ? 'kg' : 'L')
    }
    return format.format(amount) + ' ' + (unit === 'unit' ? unitLabel : unit)
  }
}
