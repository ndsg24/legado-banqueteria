import { z } from 'zod'
export const loginRequest = z.strictObject({
  email: z.email().max(254),
  password: z.string().min(1).max(512),
})
export type LoginRequestDto = z.input<typeof loginRequest>
