import type { SessionStore } from '../../domain/ports/output/session-store.port'
import type { SessionCredentials } from '../../domain/ports/output/session-credentials.port'
import type { SignInCommand } from '../commands/sign-in/sign-in.command'
import { refreshSeconds } from '../../domain/constants/session-lifetime'

export class SignInUseCase {
  constructor(
    private readonly store: SessionStore,
    private readonly credentials: SessionCredentials,
  ) {}
  async execute({ email, password }: SignInCommand) {
    if (!this.credentials.matches(email, password)) return
    const id = this.credentials.newId()
    const refresh = this.credentials.newRefresh()
    await this.store.start(
      id,
      this.credentials.digest(refresh),
      new Date(Date.now() + refreshSeconds * 1000),
    )
    return { access: await this.credentials.issueAccess(id), refresh }
  }
}
