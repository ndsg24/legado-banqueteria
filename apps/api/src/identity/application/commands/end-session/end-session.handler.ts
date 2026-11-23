import { Inject } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { EndSessionCommand } from './end-session.command'
import { EndSessionUseCase } from '../../use-cases/end-session.use-case'
import type { SessionStore } from '../../../domain/ports/output/session-store.port'
import type { SessionCredentials } from '../../../domain/ports/output/session-credentials.port'
import { SESSION_STORE, SESSION_CREDENTIALS } from '../../../domain/enums/tokens'

@CommandHandler(EndSessionCommand)
export class EndSessionHandler implements ICommandHandler<EndSessionCommand> {
  private readonly useCase: EndSessionUseCase
  constructor(
    @Inject(SESSION_STORE) store: SessionStore,
    @Inject(SESSION_CREDENTIALS) credentials: SessionCredentials,
  ) {
    this.useCase = new EndSessionUseCase(store, credentials)
  }
  execute(message: EndSessionCommand) {
    return this.useCase.execute(message)
  }
}
