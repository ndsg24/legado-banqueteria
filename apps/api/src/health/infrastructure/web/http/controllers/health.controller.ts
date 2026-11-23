import { Controller, Get, Inject } from '@nestjs/common'
import { DatabasePool } from '../../../../../shared'

@Controller('health')
export class HealthController {
  constructor(@Inject(DatabasePool) private readonly store: DatabasePool) {}

  @Get()
  async ready() {
    await this.store.ready()
    return { ready: true }
  }
}
