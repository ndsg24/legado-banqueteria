import { Command } from '@nestjs/cqrs'
import type { SessionTokens } from '../../../domain/models/session-tokens'

export class SignInCommand extends Command<SessionTokens | undefined> {
  constructor(
    readonly email: string,
    readonly password: string,
  ) {
    super()
  }
}
