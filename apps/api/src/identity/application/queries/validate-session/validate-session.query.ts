import { Query } from '@nestjs/cqrs'
import type { SessionCredentials } from '../../../domain/ports/output/session-credentials.port'

export class ValidateSessionQuery extends Query<SessionCredentials['profile'] | undefined> {
  constructor(readonly token: string) {
    super()
  }
}
