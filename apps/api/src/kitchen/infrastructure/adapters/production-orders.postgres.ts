import { Inject, Injectable } from '@nestjs/common'
import type { ProductionOrder } from '@legado/domain/operations/purchasing'
import { DatabasePool } from '../../../shared'
import { ProductionOrders } from '../../domain/ports/output/production-orders.port'

@Injectable()
export class PostgresProductionOrders extends ProductionOrders {
  constructor(@Inject(DatabasePool) private readonly db: DatabasePool) {
    super()
  }
  async confirmed(from: string, to: string) {
    const { rows } = await this.db.query<ProductionOrder>(
      `SELECT number::text AS number, payload->>'date' AS date, (payload->>'guests')::integer AS guests,
        payload->'items' AS items, payload->'sauces' AS sauces, payload->'omittedIngredients' AS "omittedIngredients"
        FROM quotes WHERE status = 'confirmed' AND received_at > now() - interval '30 days'
        AND payload->>'date' BETWEEN $1 AND $2 ORDER BY payload->>'date', quotes.number`,
      [from, to],
    )
    return rows
  }
}
