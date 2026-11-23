import { Inject } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { ChangeQuoteStatusCommand } from './change-quote-status.command'
import { ChangeQuoteStatusUseCase } from '../../use-cases/change-quote-status.use-case'
import { QUOTE_WRITER, type QuoteWriter } from '../../../domain/ports/output/quote-writer.port'

@CommandHandler(ChangeQuoteStatusCommand)
export class ChangeQuoteStatusHandler implements ICommandHandler<ChangeQuoteStatusCommand> {
  private readonly useCase: ChangeQuoteStatusUseCase
  constructor(@Inject(QUOTE_WRITER) repository: QuoteWriter) {
    this.useCase = new ChangeQuoteStatusUseCase(repository)
  }
  execute(message: ChangeQuoteStatusCommand) {
    return this.useCase.execute(message)
  }
}
