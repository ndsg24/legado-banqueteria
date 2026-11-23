import { Module } from '@nestjs/common'
import { SaveRecipeModule } from './save-recipe/save-recipe.module'

@Module({
  imports: [SaveRecipeModule],
  exports: [SaveRecipeModule],
})
export class CommandsModule {}
