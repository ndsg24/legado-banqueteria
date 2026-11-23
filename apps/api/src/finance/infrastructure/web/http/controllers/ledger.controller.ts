import type { RecordMovementRequestDto, LedgerQueryDto } from '../dtos/requests/ledger.request.dto'
import type { LedgerResponseDto } from '../dtos/responses/ledger.response.dto'
import { Body, Controller, Get, HttpCode, Inject, Post, Query } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { LedgerMapper } from '../../../mappers/ledger.mapper'
import { LedgerPresenter } from '../../../mappers/ledger.presenter'

@Controller('admin/ledger')
export class LedgerController {
  constructor(
    @Inject(CommandBus) private readonly commands: CommandBus,
    @Inject(QueryBus) private readonly queries: QueryBus,
  ) {}

  @Get()
  async list(@Query() query: LedgerQueryDto): Promise<LedgerResponseDto> {
    return LedgerPresenter.page(await this.queries.execute(LedgerMapper.toReadLedgerQuery(query)))
  }

  @Post()
  @HttpCode(204)
  async record(@Body() body: RecordMovementRequestDto): Promise<void> {
    LedgerPresenter.movementResult(
      await this.commands.execute(LedgerMapper.toRecordMovementCommand(body)),
    )
  }
}
