import { Inject } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { ReceiveQuoteCommand } from './receive-quote.command'
import { ReceiveQuoteUseCase } from '../../use-cases/receive-quote.use-case'
import { QUOTE_WRITER, type QuoteWriter } from '../../../domain/ports/output/quote-writer.port'

@CommandHandler(ReceiveQuoteCommand)
export class ReceiveQuoteHandler implements ICommandHandler<ReceiveQuoteCommand> {
  private readonly useCase: ReceiveQuoteUseCase
  constructor(@Inject(QUOTE_WRITER) repository: QuoteWriter) {
    this.useCase = new ReceiveQuoteUseCase(repository)
  }
  execute(message: ReceiveQuoteCommand) {
    return this.useCase.execute(message)
  }
}
