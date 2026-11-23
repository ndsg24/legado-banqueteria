import type { SessionStore } from '../../domain/ports/output/session-store.port'
import type { SessionCredentials } from '../../domain/ports/output/session-credentials.port'
import type { ValidateSessionQuery } from '../queries/validate-session/validate-session.query'

export class ValidateSessionUseCase {
  constructor(
    private readonly store: SessionStore,
    private readonly credentials: SessionCredentials,
  ) {}
  async execute({ token }: ValidateSessionQuery) {
    const id = await this.credentials.verifyAccess(token)
    if (id && (await this.store.active(id))) return this.credentials.profile
  }
}
