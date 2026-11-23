import { Module } from '@nestjs/common'
import { DatabaseModule } from '../shared'
import { HealthController } from './infrastructure/web/http/controllers/health.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [HealthController],
})
export class HealthModule {}
