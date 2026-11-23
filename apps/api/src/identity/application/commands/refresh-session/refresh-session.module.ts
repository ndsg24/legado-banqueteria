import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { RefreshSessionHandler } from './refresh-session.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [RefreshSessionHandler],
  exports: [RefreshSessionHandler],
})
export class RefreshSessionModule {}
