import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

// Load the same TypeScript domain modules as the apps without shipping fixtures in either app.
async function loadFixtures() {
  const { outputFiles } = await build({
    stdin: {
      contents:
        "export { seedQuotes } from './quotes.mjs'; export { seedOperations } from './operations.mjs'",
      resolveDir: fileURLToPath(new URL('.', import.meta.url)),
    },
    bundle: true,
    platform: 'node',
    target: 'node22',
    format: 'esm',
    write: false,
  })
  const source = Buffer.from(outputFiles[0].contents).toString('base64')
  return import('data:text/javascript;base64,' + source)
}

export async function seedDemo(pool) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const {
      rows: [context],
    } = await client.query(
      "SELECT current_database() AS db, to_char(now() AT TIME ZONE 'America/Santiago','YYYY-MM-DD') AS today",
    )
    if (context.db !== 'legado_admin_demo')
      throw new Error('La carga requiere la base legado_admin_demo.')
    await client.query('SELECT pg_advisory_xact_lock(54152799)')
    await client.query(
      'CREATE TABLE IF NOT EXISTS demo_seed (version integer PRIMARY KEY, seeded_on date NOT NULL)',
    )
    const previous = await client.query(
      "SELECT to_char(seeded_on,'YYYY-MM-DD') AS day FROM demo_seed WHERE version=1",
    )
    if (previous.rowCount) {
      await client.query('COMMIT')
      return { initialized: false, seededOn: previous.rows[0].day }
    }

    const fixtures = await loadFixtures()
    const quotes = await fixtures.seedQuotes(client, context.today)
    const operations = await fixtures.seedOperations(client, quotes, context.today)
    await client.query('INSERT INTO demo_seed(version, seeded_on) VALUES (1, $1)', [context.today])
    await client.query('COMMIT')
    return { initialized: true, seededOn: context.today, quotes: quotes.length, ...operations }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
