import { Inject } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { SignInCommand } from './sign-in.command'
import { SignInUseCase } from '../../use-cases/sign-in.use-case'
import type { SessionStore } from '../../../domain/ports/output/session-store.port'
import type { SessionCredentials } from '../../../domain/ports/output/session-credentials.port'
import { SESSION_STORE, SESSION_CREDENTIALS } from '../../../domain/enums/tokens'

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
  private readonly useCase: SignInUseCase
  constructor(
    @Inject(SESSION_STORE) store: SessionStore,
    @Inject(SESSION_CREDENTIALS) credentials: SessionCredentials,
  ) {
    this.useCase = new SignInUseCase(store, credentials)
  }
  execute(message: SignInCommand) {
    return this.useCase.execute(message)
  }
}
