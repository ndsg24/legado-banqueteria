import { z } from 'zod'
import { quoteSortFields, quoteStatuses } from '@legado/domain/quote/history'
import { eventCodes } from '@legado/domain/quote/wire'

export const quoteNumber = z.string().regex(/^[1-9]\d{0,17}$/)
const statusFilter = z.enum([...quoteStatuses, 'active'])
export const changeStatusRequest = z.strictObject({
  expectedStatus: z.enum(quoteStatuses),
  status: z.enum(quoteStatuses),
})
export type ChangeStatusRequestDto = z.input<typeof changeStatusRequest>
export const historyRequest = z
  .strictObject({
    status: statusFilter.optional(),
    before: quoteNumber.optional(),
    page: z.coerce.number().int().min(1).max(1000000).default(1),
    pageSize: z.coerce.number().int().min(1).max(25).default(25),
    sort: z.enum(quoteSortFields).default('number'),
    direction: z.enum(['asc', 'desc']).default('desc'),
    from: z.iso.date().optional(),
    to: z.iso.date().optional(),
    search: z.string().trim().max(80).optional(),
    event: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.enum(Object.values(eventCodes)).optional(),
    ),
  })
  .refine((q) => !q.before || (q.sort === 'number' && q.direction === 'desc'))
  .refine((q) => !q.from || !q.to || q.from <= q.to)
export const calendarRequest = z.strictObject({
  status: statusFilter.default('active'),
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
})
export type CalendarRequest = z.infer<typeof calendarRequest>
export type HistoryRequest = z.infer<typeof historyRequest>

export type HistoryRequestInput = z.input<typeof historyRequest>
export type CalendarRequestInput = z.input<typeof calendarRequest>
