import {
  Injectable,
  Inject,
  type OnApplicationBootstrap,
  type OnModuleDestroy,
} from '@nestjs/common'
import { DatabasePool } from './shared'
import { purgeExpiredSessions } from './identity'
import { purgeExpiredQuotes } from './quotes'

@Injectable()
export class RetentionJob implements OnApplicationBootstrap, OnModuleDestroy {
  private timer?: NodeJS.Timeout
  private running?: Promise<void>
  constructor(@Inject(DatabasePool) private readonly db: DatabasePool) {}
  async onApplicationBootstrap() {
    await this.purge()
    this.timer = setInterval(() => {
      if (this.running) return
      this.running = this.purge()
        .catch(() => console.error('quote_retention_failed'))
        .finally(() => {
          this.running = undefined
        })
    }, 3_600_000).unref()
  }
  async onModuleDestroy() {
    clearInterval(this.timer)
    await this.running
  }
  private async purge() {
    await purgeExpiredSessions(this.db)
    await purgeExpiredQuotes(this.db)
  }
}
