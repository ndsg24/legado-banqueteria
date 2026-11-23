import { Inject, Injectable } from '@nestjs/common'
import type { Recipe, RecipeBook } from '@legado/domain/operations/recipes'
import { DatabasePool } from '../../../shared'
import { KitchenRecipes } from '../../domain/ports/output/recipes.port'
@Injectable()
export class PostgresRecipes extends KitchenRecipes {
  constructor(@Inject(DatabasePool) private readonly db: DatabasePool) {
    super()
  }
  async read(): Promise<RecipeBook> {
    const { rows } = await this.db.query<Recipe>(
      'SELECT dish_id AS "dishId",revision,lines FROM kitchen_recipes ORDER BY dish_id',
    )
    return Object.fromEntries(rows.map((r) => [r.dishId, r]))
  }
  async save({ dishId, revision, lines }: Recipe) {
    const args = [dishId, JSON.stringify(lines)]
    const result =
      revision === 0
        ? await this.db.query(
            'INSERT INTO kitchen_recipes VALUES ($1,1,$2) ON CONFLICT DO NOTHING',
            args,
          )
        : await this.db.query(
            'UPDATE kitchen_recipes SET revision=revision+1,lines=$2 WHERE dish_id=$1 AND revision=$3',
            [...args, revision],
          )
    return result.rowCount === 1
  }
}
