import type { Pool } from 'pg'

export const withinRetention = "received_at > now() - interval '30 days'"

export async function purgeExpiredQuotes(db: Pick<Pool, 'query'>) {
  await db.query(`DELETE FROM quotes WHERE NOT (${withinRetention})`)
  // Keep future dates without retaining customer data. A retained quote can still be reopened.
  await db.query(`DELETE FROM confirmed_event_dates
    WHERE event_date < (now() AT TIME ZONE 'America/Santiago')::date
      AND NOT EXISTS (SELECT 1 FROM quotes WHERE (payload->>'date')::date = event_date)`)
}
