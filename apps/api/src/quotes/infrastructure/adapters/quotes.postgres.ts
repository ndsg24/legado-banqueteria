import { Inject, Injectable } from '@nestjs/common'
import { DatabaseError } from 'pg'
import { DatabasePool } from '../../../shared'
import type { QuoteRequest } from '@legado/domain/quote/request'
import type {
  QuoteDetail,
  QuoteSummary,
  CalendarDay,
  QuoteStatus,
  QuoteStatusFilter,
} from '@legado/domain/quote/history'
import type { HistoryFilter, QuoteReader } from '../../domain/ports/output/quote-reader.port'
import type {
  QuoteWriter,
  ChangeStatusResult,
  ReceiveQuoteResult,
} from '../../domain/ports/output/quote-writer.port'

import { withinRetention } from './quote-retention'

@Injectable()
export class PostgresQuoteStore implements QuoteReader, QuoteWriter {
  constructor(@Inject(DatabasePool) private readonly pool: DatabasePool) {}
  async unavailableDates(first: string, last: string) {
    const { rows } = await this.pool.query<{ date: string }>(
      `SELECT to_char(event_date, 'YYYY-MM-DD') AS date FROM confirmed_event_dates
       WHERE event_date BETWEEN $1::date AND $2::date ORDER BY event_date`,
      [first, last],
    )
    return rows.map(({ date }) => date)
  }

  async accept(id: string, quote: QuoteRequest): Promise<ReceiveQuoteResult> {
    const payload = JSON.stringify(quote)
    const inserted = await this.pool.query(
      `INSERT INTO quotes(request_id, payload)
       SELECT $1::uuid, $2::jsonb WHERE NOT EXISTS (
         SELECT 1 FROM confirmed_event_dates WHERE event_date = $3::date
       ) ON CONFLICT (request_id) DO NOTHING`,
      [id, payload, quote.date],
    )
    if (inserted.rowCount) return 'accepted'
    // An identical retry keeps its original receipt, even after the day has been booked.
    const existing = await this.pool.query<{ identical: boolean }>(
      'SELECT payload = $2::jsonb AS identical FROM quotes WHERE request_id = $1',
      [id, payload],
    )
    if (!existing.rowCount) return 'date-unavailable'
    return existing.rows[0].identical ? 'accepted' : 'conflict'
  }

  async changeStatus(
    number: string,
    expected: QuoteStatus,
    status: QuoteStatus,
  ): Promise<ChangeStatusResult> {
    try {
      const result = await this.pool.query<{ outcome: ChangeStatusResult }>(
        `WITH updated AS (
          UPDATE quotes SET status = $3 WHERE number = $1 AND ${withinRetention}
            AND status IN ($2, $3) RETURNING number
         ) SELECT CASE WHEN EXISTS (SELECT 1 FROM updated) THEN 'saved'
           WHEN EXISTS (SELECT 1 FROM quotes WHERE number = $1 AND ${withinRetention}) THEN 'conflict'
           ELSE 'missing' END AS outcome`,
        [number, expected, status],
      )
      return result.rows[0].outcome
    } catch (error) {
      if (
        error instanceof DatabaseError &&
        error.code === '23505' &&
        error.constraint === 'confirmed_event_dates_pkey'
      )
        return 'date-unavailable'
      throw error
    }
  }

  async history({
    before,
    status,
    page,
    pageSize,
    event,
    search,
    sort = 'number',
    direction,
    from,
    to,
  }: HistoryFilter) {
    const column = {
      number: 'number',
      event: 'event',
      location: 'location',
      date: 'date',
      guests: 'guests::int',
    }[sort]
    const order =
      column + (direction === 'asc' ? ' ASC' : ' DESC') + (sort === 'number' ? '' : ', number DESC')
    const result = await this.pool.query<{ rows: QuoteSummary[]; total: number }>(
      `WITH matches AS (
         SELECT number, status, payload->>'event' AS event, payload->>'date' AS date,
                payload->>'guests' AS guests, payload->>'location' AS location
         FROM quotes WHERE ${withinRetention}
           AND ($1::bigint IS NULL OR number < $1)
           AND ($2::text IS NULL OR payload->>'event' = $2)
           AND ($3::text IS NULL OR strpos(lower(payload->>'location'), lower($3)) > 0 OR number::text = $3)
           AND ($6::text IS NULL OR payload->>'date' >= $6)
           AND ($7::text IS NULL OR payload->>'date' <= $7)
           AND ($8::text IS NULL OR status = $8 OR ($8 = 'active' AND status <> 'cancelled'))
       ), slice AS (
         SELECT * FROM matches ORDER BY ${order} LIMIT $4 OFFSET $5
       )
       SELECT (SELECT count(*)::int FROM matches) AS total,
         COALESCE((SELECT json_agg(json_build_object('number',number::text,'event',event,
           'guests',guests,'location',location,'date',date,'status',status)
           ORDER BY ${order}) FROM slice), '[]') AS rows`,
      [
        before ?? null,
        event ?? null,
        search || null,
        pageSize,
        (page - 1) * pageSize,
        from ?? null,
        to ?? null,
        status ?? null,
      ],
    )
    return result.rows[0]
  }

  async calendar(month: string, status: QuoteStatusFilter) {
    const result = await this.pool.query<CalendarDay>(
      `SELECT payload->>'date' AS date, count(*)::int AS count, sum((payload->>'guests')::int)::int AS guests,
              (array_agg(payload->>'event' ORDER BY number DESC))[1] AS event
       FROM quotes WHERE ${withinRetention} AND left(payload->>'date', 7) = $1
         AND (status = $2 OR ($2 = 'active' AND status <> 'cancelled'))
       GROUP BY payload->>'date' ORDER BY date`,
      [month, status],
    )
    return result.rows
  }

  async detail(number: string) {
    const result = await this.pool.query<QuoteDetail>(
      `SELECT number, status, payload,
              (status <> 'confirmed' AND EXISTS (
                SELECT 1 FROM confirmed_event_dates WHERE event_date = (payload->>'date')::date
              )) AS "dateBookedByAnotherEvent"
       FROM quotes WHERE ${withinRetention} AND number = $1`,
      [number],
    )
    return result.rows[0]
  }
}
