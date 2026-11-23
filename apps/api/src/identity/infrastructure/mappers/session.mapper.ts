import { EndSessionCommand } from '../../application/commands/end-session/end-session.command'
import { RefreshSessionCommand } from '../../application/commands/refresh-session/refresh-session.command'
import { SignInCommand } from '../../application/commands/sign-in/sign-in.command'
import type { LoginRequestDto } from '../web/http/dtos/requests/login.request.dto'
import type { RefreshRequestDto } from '../web/http/dtos/requests/refresh.request.dto'

export class SessionMapper {
  static toSignInCommand(body: LoginRequestDto) {
    return new SignInCommand(body.email, body.password)
  }

  static toRefreshSessionCommand(body: RefreshRequestDto) {
    return new RefreshSessionCommand(body.refreshToken)
  }

  static toEndSessionCommand(body: RefreshRequestDto) {
    return new EndSessionCommand(body.refreshToken)
  }
}
