import { ReceiveQuoteCommand } from '../../application/commands/receive-quote/receive-quote.command'
import type { IntakeRequest } from '../web/http/dtos/requests/intake.request.dto'

export class IntakeMapper {
  static toReceiveQuoteCommand({ id, quote }: IntakeRequest) {
    return new ReceiveQuoteCommand(id, quote)
  }
}
