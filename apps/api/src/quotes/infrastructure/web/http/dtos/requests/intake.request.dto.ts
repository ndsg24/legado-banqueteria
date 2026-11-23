import { z } from 'zod'
import { quoteSchema } from '@legado/domain/quote/request'
import { decodeQuoteInput } from '@legado/domain/quote/wire'

export const intakeRequest = z.strictObject({
  id: z.uuid(),
  quote: z.preprocess(decodeQuoteInput, quoteSchema),
})
export type IntakeRequest = z.infer<typeof intakeRequest>

export type IntakeRequestDto = z.input<typeof intakeRequest>
