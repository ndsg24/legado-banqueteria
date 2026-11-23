import { z } from 'zod'

export const profileResponse = z.strictObject({ displayName: z.string().min(1), email: z.email() })

export type ProfileResponseDto = z.output<typeof profileResponse>
