import { Inject } from '@nestjs/common'
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs'
import { SaveRecipeCommand } from './save-recipe.command'
import { SaveRecipeUseCase } from '../../use-cases/save-recipe.use-case'
import { KitchenRecipes } from '../../../domain/ports/output/recipes.port'

@CommandHandler(SaveRecipeCommand)
export class SaveRecipeHandler implements ICommandHandler<SaveRecipeCommand> {
  private readonly useCase: SaveRecipeUseCase
  constructor(@Inject(KitchenRecipes) repository: KitchenRecipes) {
    this.useCase = new SaveRecipeUseCase(repository)
  }
  execute(message: SaveRecipeCommand) {
    return this.useCase.execute(message)
  }
}
