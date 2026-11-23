import { Injectable, Inject } from '@nestjs/common'
import { DatabasePool } from '../../../shared'
import {
  Ledger,
  type LedgerSlice,
  type MovementOutcome,
} from '../../domain/ports/output/ledger.port'
import { type Movement, type LedgerFilters } from '@legado/domain/operations/finance'

@Injectable()
export class PostgresLedger extends Ledger {
  constructor(@Inject(DatabasePool) private readonly db: DatabasePool) {
    super()
  }

  async record({ id, date, category, amount, quoteNumber }: Movement): Promise<MovementOutcome> {
    try {
      const result = await this.db.query(
        `INSERT INTO financial_movements AS m (id,booked_on,category,amount,quote_number,event_reference)
         VALUES ($1,$2,$3,$4,$5,$5) ON CONFLICT(id) DO UPDATE SET id = m.id
         WHERE (m.booked_on,m.category,m.amount,m.event_reference) IS NOT DISTINCT FROM
               (EXCLUDED.booked_on,EXCLUDED.category,EXCLUDED.amount,EXCLUDED.event_reference)`,
        [id, date, category, amount, quoteNumber],
      )
      return result.rowCount ? 'saved' : 'conflict'
    } catch (error) {
      if ((error as { code?: string }).code === '23503') return 'unknown-quote'
      throw error
    }
  }
  async list(filters: LedgerFilters): Promise<LedgerSlice> {
    const pageSize = 10
    const {
      rows: [row],
    } = await this.db.query<Omit<LedgerSlice, 'pageSize'>>(
      `
      WITH filtered AS (
        SELECT id, booked_on AS date, category, amount, event_reference::text AS "quoteNumber",
               quote_number IS NOT NULL AS "quoteAvailable"
        FROM financial_movements
        WHERE ($1::date IS NULL OR booked_on >= $1 AND booked_on < $1 + interval '1 month')
        AND ($2::bigint IS NULL OR event_reference = $2)
        AND ($3::text IS NULL OR category = $3)
      ), counts AS (SELECT count(*)::int AS total FROM filtered),
      paging AS (SELECT total, least($4::int,greatest(1,ceil(total::numeric/$5)::int)) AS page FROM counts),
      summary AS (SELECT category,sum(amount) AS value FROM filtered GROUP BY category)
      SELECT total,page,
        coalesce((SELECT json_object_agg(category,value) FROM summary),'{}') AS breakdown,
        coalesce((SELECT json_agg(e ORDER BY date DESC,id DESC) FROM (
          SELECT * FROM filtered ORDER BY date DESC,id DESC LIMIT $5 OFFSET ((SELECT page FROM paging)-1)*$5
        ) e),'[]') AS items FROM paging`,
      [
        filters.month ? filters.month + '-01' : null,
        filters.quoteNumber,
        filters.category,
        filters.page,
        pageSize,
      ],
    )
    return {
      items: row.items,
      total: row.total,
      page: row.page,
      pageSize,
      breakdown: row.breakdown,
    }
  }
}
