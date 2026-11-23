import { BadRequestException } from '@nestjs/common'
import { purchaseRange } from '../web/http/dtos/requests/purchasing.request.dto'
import { GetPurchasingQuery } from '../../application/queries/get-purchasing/get-purchasing.query'

export class PurchasingMapper {
  static toQuery(input: unknown) {
    const result = purchaseRange.safeParse(input)
    if (!result.success) throw new BadRequestException('Select a valid period of up to 31 days.')
    return new GetPurchasingQuery(result.data.from, result.data.to)
  }
}
