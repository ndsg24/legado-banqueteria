import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module'
import { GetPurchasingHandler } from './get-purchasing.handler'

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [GetPurchasingHandler],
  exports: [GetPurchasingHandler],
})
export class GetPurchasingModule {}
