import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ApplicationModule } from './application/application.module'
import { InfrastructureModule } from './infrastructure/infrastructure.module'

@Module({
  imports: [CqrsModule, ApplicationModule, InfrastructureModule],
  exports: [InfrastructureModule],
})
export class FinanceModule {}
