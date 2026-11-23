import { eventDateUnavailableCode } from '@legado/domain/quote/availability'
import { QuoteAvailabilityQuery } from '../../../../application/queries/quote-availability/quote-availability.query'
import type { AvailabilityResponseDto } from '../dtos/responses/availability.response.dto'
import type { ReceiptResponseDto } from '../dtos/responses/receipt.response.dto'
import {
  Body,
  Controller,
  ConflictException,
  ForbiddenException,
  Get,
  Headers,
  HttpCode,
  Inject,
  Post,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { intakeRequest, type IntakeRequestDto } from '../dtos/requests/intake.request.dto'
import { IntakeMapper } from '../../../mappers/intake.mapper'
import { IntakePresenter } from '../../../mappers/intake.presenter'
import { demoOrigin } from '../../../../../shared'

@Controller('quotes')
export class IntakeController {
  constructor(
    @Inject(CommandBus) private readonly commands: CommandBus,
    @Inject(QueryBus) private readonly queries: QueryBus,
  ) {}

  @Get('availability')
  async availability(): Promise<AvailabilityResponseDto> {
    return IntakePresenter.availability(await this.queries.execute(new QuoteAvailabilityQuery()))
  }

  @Post()
  @HttpCode(202)
  async accept(
    @Body() body: IntakeRequestDto,
    @Headers('origin') origin: string,
    @Headers('content-type') type: string,
  ): Promise<ReceiptResponseDto> {
    if (origin !== demoOrigin && origin !== 'http://127.0.0.1:3000') throw new ForbiddenException()
    if (type?.split(';')[0].trim() !== 'application/json') throw new UnsupportedMediaTypeException()
    const result = intakeRequest.safeParse(body)
    if (!result.success) throw new UnprocessableEntityException()
    const outcome = await this.commands.execute(IntakeMapper.toReceiveQuoteCommand(result.data))
    if (outcome === 'invalid-pilot-contact')
      throw new UnprocessableEntityException(
        'Use an @example.test email and leave phone and free-text fields empty.',
      )
    if (outcome === 'date-unavailable')
      throw new ConflictException({
        code: eventDateUnavailableCode,
        message: 'An event is already confirmed on this date.',
      })
    if (outcome === 'conflict')
      throw new ConflictException('Request ID already used for a different quote.')
    return IntakePresenter.receipt()
  }
}
