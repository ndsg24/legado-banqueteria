import { z } from 'zod'
export const refreshRequest = z.strictObject({
  refreshToken: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
})
export type RefreshRequestDto = z.input<typeof refreshRequest>
