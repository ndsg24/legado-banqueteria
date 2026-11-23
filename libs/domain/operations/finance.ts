import { z } from 'zod'

export const incomeCategories = ['deposit', 'payment'] as const
export const expenseCategories = [
  'supplies',
  'staff',
  'rentals',
  'transport',
  'otherExpense',
] as const
export const categories = ['sale', ...incomeCategories, ...expenseCategories] as const
export type Category = (typeof categories)[number]
export function isIncome(category: Category) {
  return category === 'deposit' || category === 'payment'
}
export const quoteReference = z.string().regex(/^[1-9]\d{0,17}$/)
export const movementSchema = z.strictObject({
  id: z.uuid(),
  date: z.iso.date().regex(/^[1-9]/),
  category: z.enum(categories),
  amount: z.number().int().positive().max(999999999),
  quoteNumber: quoteReference.nullable(),
})
export const ledgerFilters = z.strictObject({
  month: z
    .string()
    .regex(/^[1-9]\d{3}-(0[1-9]|1[0-2])$/)
    .optional(),
  quoteNumber: quoteReference.optional(),
  category: z.enum(categories).optional(),
  page: z.coerce.number().int().min(1).max(100000).default(1),
})
export type Movement = z.infer<typeof movementSchema>
export type LedgerFilters = z.infer<typeof ledgerFilters>
export interface LedgerPage {
  items: (Movement & { quoteAvailable: boolean })[]
  breakdown: Partial<Record<Category, number>>
  profit: number
  sales: number
  income: number
  expenses: number
  balance: number
  total: number
  page: number
  pageSize: number
}

export function summarizeLedger(breakdown: LedgerPage['breakdown']) {
  const income = incomeCategories.reduce((sum, k) => sum + (breakdown[k] ?? 0), 0)
  const expenses = expenseCategories.reduce((sum, k) => sum + (breakdown[k] ?? 0), 0)
  const sales = breakdown.sale ?? 0
  return { sales, income, expenses, balance: income - expenses, profit: sales - expenses }
}
