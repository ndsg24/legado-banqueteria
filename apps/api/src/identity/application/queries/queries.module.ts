import { Module } from '@nestjs/common'
import { ValidateSessionModule } from './validate-session/validate-session.module'

@Module({
  imports: [ValidateSessionModule],
  exports: [ValidateSessionModule],
})
export class QueriesModule {}
