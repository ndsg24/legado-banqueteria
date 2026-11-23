import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../../shared'
import { SESSION_STORE, SESSION_CREDENTIALS } from '../../domain/enums/tokens'
import { PgSessions } from './sessions.postgres'
import { PilotCredentials } from './pilot-credentials'

@Module({
  imports: [DatabaseModule],
  providers: [
    { provide: SESSION_STORE, useClass: PgSessions },
    { provide: SESSION_CREDENTIALS, useClass: PilotCredentials },
  ],
  exports: [SESSION_STORE, SESSION_CREDENTIALS],
})
export class AdaptersModule {}
