import { Query } from '@nestjs/cqrs'
import type { RecipeBook } from '@legado/domain/operations/recipes'

export class GetRecipesQuery extends Query<RecipeBook> {}
