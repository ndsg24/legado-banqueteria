import { Command } from '@nestjs/cqrs'
import type { SessionTokens } from '../../../domain/models/session-tokens'

export class RefreshSessionCommand extends Command<SessionTokens | undefined> {
  constructor(readonly refreshToken: string) {
    super()
  }
}
