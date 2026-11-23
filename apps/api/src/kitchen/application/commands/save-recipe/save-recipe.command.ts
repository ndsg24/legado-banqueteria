import { Command } from '@nestjs/cqrs'
import type { Recipe } from '@legado/domain/operations/recipes'

export class SaveRecipeCommand extends Command<boolean> {
  constructor(readonly recipe: Recipe) {
    super()
  }
}
