import { Inject } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { RefreshSessionCommand } from './refresh-session.command'
import { RefreshSessionUseCase } from '../../use-cases/refresh-session.use-case'
import type { SessionStore } from '../../../domain/ports/output/session-store.port'
import type { SessionCredentials } from '../../../domain/ports/output/session-credentials.port'
import { SESSION_STORE, SESSION_CREDENTIALS } from '../../../domain/enums/tokens'

@CommandHandler(RefreshSessionCommand)
export class RefreshSessionHandler implements ICommandHandler<RefreshSessionCommand> {
  private readonly useCase: RefreshSessionUseCase
  constructor(
    @Inject(SESSION_STORE) store: SessionStore,
    @Inject(SESSION_CREDENTIALS) credentials: SessionCredentials,
  ) {
    this.useCase = new RefreshSessionUseCase(store, credentials)
  }
  execute(message: RefreshSessionCommand) {
    return this.useCase.execute(message)
  }
}
