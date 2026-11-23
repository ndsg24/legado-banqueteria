import type { SessionStore } from '../../domain/ports/output/session-store.port'
import type { SessionCredentials } from '../../domain/ports/output/session-credentials.port'
import type { RefreshSessionCommand } from '../commands/refresh-session/refresh-session.command'

export class RefreshSessionUseCase {
  constructor(
    private readonly store: SessionStore,
    private readonly credentials: SessionCredentials,
  ) {}
  async execute({ refreshToken: token }: RefreshSessionCommand) {
    const refresh = this.credentials.newRefresh()
    const id = await this.store.rotate(
      this.credentials.digest(token),
      this.credentials.digest(refresh),
    )
    if (id) return { access: await this.credentials.issueAccess(id), refresh }
  }
}
