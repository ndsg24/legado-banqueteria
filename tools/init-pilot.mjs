import { randomBytes } from 'node:crypto'
import { appendFile, readFile } from 'node:fs/promises'

const current = await readFile('.env', 'utf8').catch((error) => {
  if (error.code !== 'ENOENT') throw error
  return ''
})
const defaults = {
  POSTGRES_PASSWORD: randomBytes(24).toString('hex'),
  APP_DB_PASSWORD: randomBytes(24).toString('hex'),
  ADMIN_PASSWORD: randomBytes(24).toString('hex'),
  ADMIN_EMAIL: 'admin@example.test',
  ADMIN_JWT_SECRET: randomBytes(32).toString('hex'),
}
const missing = Object.entries(defaults).filter(
  ([key]) => !new RegExp('^' + key + '=', 'm').test(current),
)
if (missing.length) {
  const lines = missing.map(([key, value]) => key + '=' + value).join('\n')
  await appendFile('.env', (current && !current.endsWith('\n') ? '\n' : '') + lines + '\n', {
    mode: 0o600,
  })
}
console.log('Configuración del piloto disponible en .env.')
