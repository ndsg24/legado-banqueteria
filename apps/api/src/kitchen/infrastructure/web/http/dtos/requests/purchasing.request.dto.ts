import { z } from 'zod'

export const purchaseRange = z
  .strictObject({ from: z.iso.date(), to: z.iso.date() })
  .refine(({ from, to }) => from <= to && Date.parse(to) - Date.parse(from) <= 30 * 86400000)
export type PurchaseRangeDto = z.input<typeof purchaseRange>
