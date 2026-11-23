import { Command } from '@nestjs/cqrs'

export class EndSessionCommand extends Command<void> {
  constructor(readonly refreshToken: string) {
    super()
  }
}
