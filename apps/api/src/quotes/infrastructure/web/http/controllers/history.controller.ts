import type {
  ChangeStatusResponseDto,
  CalendarDayResponseDto,
  QuoteDetailResponseDto,
  QuotePageResponseDto,
} from '../dtos/responses/history.response.dto'
import {
  Body,
  Post,
  HttpCode,
  BadRequestException,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import {
  type ChangeStatusRequestDto,
  calendarRequest,
  historyRequest,
  quoteNumber,
  type HistoryRequestInput,
  type CalendarRequestInput,
} from '../dtos/requests/history.request.dto'
import { HistoryMapper } from '../../../mappers/history.mapper'
import { HistoryPresenter } from '../../../mappers/history.presenter'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetQuoteQuery } from '../../../../application/queries/get-quote/get-quote.query'
import { ListQuotesQuery } from '../../../../application/queries/list-quotes/list-quotes.query'

@Controller('admin')
export class HistoryController {
  constructor(
    @Inject(QueryBus) private readonly queries: QueryBus,
    @Inject(CommandBus) private readonly commands: CommandBus,
  ) {}

  @Post('quotes/:number/status')
  @HttpCode(204)
  async changeStatus(
    @Param('number') number: string,
    @Body() body: ChangeStatusRequestDto,
  ): Promise<ChangeStatusResponseDto> {
    const result = await this.commands.execute(HistoryMapper.toChangeStatusCommand(number, body))
    return HistoryPresenter.statusChange(result)
  }

  @Get('quotes')
  async list(@Query() query: HistoryRequestInput): Promise<QuotePageResponseDto> {
    const input = historyRequest.safeParse(query)
    if (!input.success) throw new BadRequestException('Invalid quote filters or pagination.')
    return HistoryPresenter.page(
      await this.queries.execute(new ListQuotesQuery(HistoryMapper.toHistoryFilter(input.data))),
    )
  }

  @Get('quotes/calendar')
  async calendar(@Query() query: CalendarRequestInput): Promise<CalendarDayResponseDto[]> {
    const input = calendarRequest.safeParse(query)
    if (!input.success) throw new BadRequestException('Invalid calendar month.')
    return HistoryPresenter.calendar(
      await this.queries.execute(HistoryMapper.toCalendarQuery(input.data)),
    )
  }

  @Get('quotes/:number')
  async detail(@Param('number') number: string): Promise<QuoteDetailResponseDto> {
    if (!quoteNumber.safeParse(number).success)
      throw new BadRequestException('Invalid quote number.')
    const quote = await this.queries.execute(new GetQuoteQuery(number))
    if (!quote) throw new NotFoundException()
    return HistoryPresenter.detail(quote)
  }
}
