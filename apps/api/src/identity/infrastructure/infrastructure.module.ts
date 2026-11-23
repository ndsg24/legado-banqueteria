import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { AdaptersModule } from './adapters/adapters.module'
import { AuthController } from './web/http/controllers/auth.controller'
import { ProfileController } from './web/http/controllers/profile.controller'

@Module({
  imports: [CqrsModule, AdaptersModule],
  controllers: [AuthController, ProfileController],
  exports: [AdaptersModule],
})
export class InfrastructureModule {}
