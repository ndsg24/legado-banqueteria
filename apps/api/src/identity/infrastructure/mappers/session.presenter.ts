import { accessSeconds } from '../../domain/constants/session-lifetime'
import type { SessionResponseDto } from '../web/http/dtos/responses/session.response.dto'

export class SessionPresenter {
  static toResponse(pair: { access: string; refresh: string }): SessionResponseDto {
    return {
      tokenType: 'Bearer',
      accessToken: pair.access,
      refreshToken: pair.refresh,
      expiresIn: accessSeconds,
    }
  }
}
