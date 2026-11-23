import { Inject } from '@nestjs/common'
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs'
import { ValidateSessionQuery } from './validate-session.query'
import { ValidateSessionUseCase } from '../../use-cases/validate-session.use-case'
import type { SessionStore } from '../../../domain/ports/output/session-store.port'
import type { SessionCredentials } from '../../../domain/ports/output/session-credentials.port'
import { SESSION_STORE, SESSION_CREDENTIALS } from '../../../domain/enums/tokens'

@QueryHandler(ValidateSessionQuery)
export class ValidateSessionHandler implements IQueryHandler<ValidateSessionQuery> {
  private readonly useCase: ValidateSessionUseCase
  constructor(
    @Inject(SESSION_STORE) store: SessionStore,
    @Inject(SESSION_CREDENTIALS) credentials: SessionCredentials,
  ) {
    this.useCase = new ValidateSessionUseCase(store, credentials)
  }
  execute(message: ValidateSessionQuery) {
    return this.useCase.execute(message)
  }
}
