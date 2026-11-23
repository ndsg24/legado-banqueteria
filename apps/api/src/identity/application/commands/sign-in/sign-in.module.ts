import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { SignInHandler } from './sign-in.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [SignInHandler],
  exports: [SignInHandler],
})
export class SignInModule {}
