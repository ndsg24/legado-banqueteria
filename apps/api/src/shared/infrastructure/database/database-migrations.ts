import type { Pool } from 'pg'
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

export async function applyMigrations(pool: Pool) {
  const db = await pool.connect()
  try {
    await db.query('BEGIN')
    await db.query('SELECT pg_advisory_xact_lock(48670311)')
    await db.query('CREATE TABLE IF NOT EXISTS migrations (name text PRIMARY KEY)')
    const folder = join(__dirname, 'migrations')
    for (const name of (await readdir(folder)).filter((file) => file.endsWith('.sql')).sort()) {
      if ((await db.query('SELECT 1 FROM migrations WHERE name = $1', [name])).rowCount) continue
      await db.query(await readFile(join(folder, name), 'utf8'))
      await db.query('INSERT INTO migrations VALUES ($1)', [name])
    }
    await db.query('COMMIT')
  } catch (error) {
    await db.query('ROLLBACK')
    throw error
  } finally {
    db.release()
  }
}
