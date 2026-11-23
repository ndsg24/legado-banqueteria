import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { ValidateSessionHandler } from './validate-session.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [ValidateSessionHandler],
  exports: [ValidateSessionHandler],
})
export class ValidateSessionModule {}
