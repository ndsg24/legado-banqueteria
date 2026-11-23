import { RetentionJob } from './retention.job'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { KitchenModule } from './kitchen'
import { FinanceModule } from './finance'
import { IdentityModule } from './identity'
import { QuotesModule } from './quotes'
import { DatabaseModule } from './shared'
import { HealthModule } from './health'

@Module({
  imports: [
    CqrsModule.forRoot(),
    DatabaseModule,
    IdentityModule,
    QuotesModule,
    FinanceModule,
    KitchenModule,
    HealthModule,
  ],
  providers: [RetentionJob],
})
export class AppModule {}
