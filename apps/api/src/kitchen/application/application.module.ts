import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { CommandsModule } from './commands/commands.module'
import { QueriesModule } from './queries/queries.module'

@Module({
  imports: [CqrsModule, CommandsModule, QueriesModule],
  exports: [CqrsModule, CommandsModule, QueriesModule],
})
export class ApplicationModule {}
