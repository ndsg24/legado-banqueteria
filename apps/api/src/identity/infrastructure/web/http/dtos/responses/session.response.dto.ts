import { z } from 'zod'
import { accessSeconds } from '../../../../../domain/constants/session-lifetime'

import { refreshRequest } from '../requests/refresh.request.dto'
export const sessionResponse = z.strictObject({
  tokenType: z.literal('Bearer'),
  accessToken: z.string(),
  refreshToken: refreshRequest.shape.refreshToken,
  expiresIn: z.literal(accessSeconds),
})
export type SessionResponseDto = z.output<typeof sessionResponse>
