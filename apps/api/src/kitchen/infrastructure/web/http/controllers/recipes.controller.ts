import type { SaveRecipeRequestDto } from '../dtos/requests/recipes.request.dto'
import type { RecipesResponseDto } from '../dtos/responses/recipes.response.dto'
import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetRecipesQuery } from '../../../../application/queries/get-recipes/get-recipes.query'
import { RecipesMapper } from '../../../mappers/recipes.mapper'
import { RecipesPresenter } from '../../../mappers/recipes.presenter'

@Controller('admin/recipes')
export class RecipesController {
  constructor(
    @Inject(QueryBus) private readonly queries: QueryBus,
    @Inject(CommandBus) private readonly commands: CommandBus,
  ) {}

  @Get()
  async list(): Promise<RecipesResponseDto> {
    return RecipesPresenter.book(await this.queries.execute(new GetRecipesQuery()))
  }

  @Post()
  @HttpCode(204)
  async save(@Body() body: SaveRecipeRequestDto): Promise<void> {
    RecipesPresenter.saveResult(
      await this.commands.execute(RecipesMapper.toSaveRecipeCommand(body)),
    )
  }
}
