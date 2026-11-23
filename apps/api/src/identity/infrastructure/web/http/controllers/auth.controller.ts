import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { SessionMapper } from '../../../mappers/session.mapper'
import { loginRequest, type LoginRequestDto } from '../dtos/requests/login.request.dto'
import { refreshRequest, type RefreshRequestDto } from '../dtos/requests/refresh.request.dto'
import type { SessionResponseDto } from '../dtos/responses/session.response.dto'
import { SessionPresenter } from '../../../mappers/session.presenter'

@Controller('auth')
export class AuthController {
  constructor(@Inject(CommandBus) private readonly commands: CommandBus) {}
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginRequestDto): Promise<SessionResponseDto> {
    const input = loginRequest.safeParse(body)
    if (!input.success) throw new BadRequestException('Invalid login request.')
    const pair = await this.commands.execute(SessionMapper.toSignInCommand(input.data))
    if (!pair) throw new UnauthorizedException('Invalid credentials.')
    return SessionPresenter.toResponse(pair)
  }
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: RefreshRequestDto): Promise<SessionResponseDto> {
    const input = refreshRequest.safeParse(body)
    if (!input.success) throw new BadRequestException('Invalid refresh request.')
    const pair = await this.commands.execute(SessionMapper.toRefreshSessionCommand(input.data))
    if (!pair) throw new UnauthorizedException('Session expired.')
    return SessionPresenter.toResponse(pair)
  }
  @Post('logout')
  @HttpCode(204)
  async logout(@Body() body: RefreshRequestDto): Promise<void> {
    const input = refreshRequest.safeParse(body)
    if (!input.success) throw new BadRequestException('Invalid logout request.')
    await this.commands.execute(SessionMapper.toEndSessionCommand(input.data))
  }
}
