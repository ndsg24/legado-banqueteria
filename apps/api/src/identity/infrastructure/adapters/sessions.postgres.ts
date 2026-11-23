import { Inject, Injectable } from '@nestjs/common'
import { DatabasePool } from '../../../shared'
import type { SessionStore } from '../../domain/ports/output/session-store.port'

@Injectable()
export class PgSessions implements SessionStore {
  constructor(@Inject(DatabasePool) private readonly db: DatabasePool) {}
  async start(id: string, digest: string, expires: Date) {
    await this.db.query(
      `WITH created AS (INSERT INTO admin_sessions(id,expires_at) VALUES($1,$2) RETURNING id)
       INSERT INTO admin_refresh_tokens(session_id,digest) SELECT id,$3 FROM created`,
      [id, expires, digest],
    )
  }
  async active(id: string) {
    const result = await this.db.query(
      'SELECT 1 FROM admin_sessions WHERE id=$1 AND expires_at>now()',
      [id],
    )
    return !!result.rowCount
  }
  async rotate(presented: string, replacement: string) {
    const db = await this.db.connect()
    try {
      await db.query('BEGIN')
      const result = await db.query<{ id: string }>(
        `SELECT s.id FROM admin_sessions s JOIN admin_refresh_tokens t ON t.session_id=s.id
         WHERE t.digest=$1 AND s.expires_at>now() FOR UPDATE OF s`,
        [presented],
      )
      const id = result.rows[0]?.id
      if (id) {
        const used = await db.query(
          'UPDATE admin_refresh_tokens SET consumed=true WHERE digest=$1 AND NOT consumed',
          [presented],
        )
        if (!used.rowCount) {
          // Reusing a consumed credential invalidates its entire session.
          await db.query('DELETE FROM admin_sessions WHERE id=$1', [id])
          await db.query('COMMIT')
          return
        }
        await db.query('INSERT INTO admin_refresh_tokens(session_id,digest) VALUES($1,$2)', [
          id,
          replacement,
        ])
      }
      await db.query('COMMIT')
      return id
    } catch (error) {
      await db.query('ROLLBACK')
      throw error
    } finally {
      db.release()
    }
  }
  async revoke(digest: string) {
    await this.db.query(
      'DELETE FROM admin_sessions WHERE id=(SELECT session_id FROM admin_refresh_tokens WHERE digest=$1)',
      [digest],
    )
  }
}

export async function purgeExpiredSessions(db: DatabasePool) {
  await db.query('DELETE FROM admin_sessions WHERE expires_at <= now()')
}
