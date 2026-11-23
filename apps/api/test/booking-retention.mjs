import assert from 'node:assert/strict'
import { test } from 'node:test'
import pg from 'pg'
import { build } from 'esbuild'

// Use session-local tables even when the verification database already contains real quotes.
test(
  'retention removes quote details while preserving future booked dates',
  {
    skip: !process.env.TEST_DATABASE_URL && 'Set TEST_DATABASE_URL to run with PostgreSQL.',
  },
  async () => {
    const { outputFiles } = await build({
      entryPoints: ['apps/api/src/quotes/infrastructure/adapters/quote-retention.ts'],
      bundle: true,
      format: 'esm',
      platform: 'node',
      write: false,
    })
    const moduleUrl =
      'data:text/javascript;base64,' + Buffer.from(outputFiles[0].contents).toString('base64')
    const { purgeExpiredQuotes } = await import(moduleUrl)
    const db = new pg.Client({ connectionString: process.env.TEST_DATABASE_URL })
    await db.connect()
    try {
      await db.query("SET TIME ZONE 'America/Santiago'")
      await db.query('CREATE TEMP TABLE quotes(received_at timestamptz, payload jsonb)')
      await db.query('CREATE TEMP TABLE confirmed_event_dates(event_date date PRIMARY KEY)')
      await db.query(`INSERT INTO confirmed_event_dates VALUES
      (current_date + 7), (current_date - 1), (current_date - 2)`)
      await db.query(`INSERT INTO quotes VALUES
      (now() - interval '31 days', jsonb_build_object('date', current_date + 7)),
      (now() - interval '31 days', jsonb_build_object('date', current_date - 2)),
      (now() - interval '2 days', jsonb_build_object('date', current_date - 1))`)
      await purgeExpiredQuotes(db)
      assert.equal((await db.query('SELECT count(*)::int AS n FROM quotes')).rows[0].n, 1)
      const dates = await db.query(
        'SELECT event_date - current_date AS d FROM confirmed_event_dates ORDER BY d',
      )
      assert.deepEqual(dates.rows, [{ d: -1 }, { d: 7 }])
    } finally {
      await db.end()
    }
  },
)
