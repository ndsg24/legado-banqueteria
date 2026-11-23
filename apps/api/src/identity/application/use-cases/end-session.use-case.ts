import type { SessionStore } from '../../domain/ports/output/session-store.port'
import type { SessionCredentials } from '../../domain/ports/output/session-credentials.port'
import type { EndSessionCommand } from '../commands/end-session/end-session.command'

export class EndSessionUseCase {
  constructor(
    private readonly store: SessionStore,
    private readonly credentials: SessionCredentials,
  ) {}
  execute({ refreshToken: token }: EndSessionCommand) {
    return this.store.revoke(this.credentials.digest(token))
  }
}
