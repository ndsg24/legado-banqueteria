import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { EndSessionHandler } from './end-session.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [EndSessionHandler],
  exports: [EndSessionHandler],
})
export class EndSessionModule {}
