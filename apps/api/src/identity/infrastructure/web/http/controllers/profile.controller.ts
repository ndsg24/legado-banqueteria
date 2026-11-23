import { Controller, Get, HttpCode, Res } from '@nestjs/common'
import type { Response } from 'express'
import { profileResponse, type ProfileResponseDto } from '../dtos/responses/profile.response.dto'

@Controller('admin')
export class ProfileController {
  @Get('session')
  @HttpCode(204)
  session(): void {}

  @Get('profile')
  current(@Res({ passthrough: true }) response: Response): ProfileResponseDto {
    return profileResponse.parse(response.locals.adminProfile)
  }
}
