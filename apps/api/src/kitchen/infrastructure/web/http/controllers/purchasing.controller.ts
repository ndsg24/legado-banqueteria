import { Controller, Get, Inject, Query } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { PurchasingMapper } from '../../../mappers/purchasing.mapper'
import { PurchasingPresenter } from '../../../mappers/purchasing.presenter'
import type { PurchaseRangeDto } from '../dtos/requests/purchasing.request.dto'
import type { PurchasingResponseDto } from '../dtos/responses/purchasing.response.dto'

@Controller('admin/purchasing')
export class PurchasingController {
  constructor(@Inject(QueryBus) private readonly queries: QueryBus) {}
  @Get()
  async list(@Query() range: PurchaseRangeDto): Promise<PurchasingResponseDto> {
    return PurchasingPresenter.report(await this.queries.execute(PurchasingMapper.toQuery(range)))
  }
}
