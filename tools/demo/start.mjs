import { spawn, spawnSync } from 'node:child_process'
import { createHmac } from 'node:crypto'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'
import pg from 'pg'
import { seedDemo } from './seed.mjs'

const host = '127.0.0.1'
const apiPort = 3017
const panelPort = 5187
const apiOrigin = 'http://' + host + ':' + apiPort
const panelOrigin = 'http://localhost:' + panelPort

function demoDatabaseUrl() {
  if (process.env.DEMO_DATABASE_URL) {
    const url = new URL(process.env.DEMO_DATABASE_URL)
    const socket = url.searchParams.get('host')
    if (
      !['postgres:', 'postgresql:'].includes(url.protocol) ||
      !['localhost', host, '[::1]'].includes(url.hostname) ||
      url.pathname !== '/legado_admin_demo' ||
      [...url.searchParams.keys()].some((key) => key !== 'host') ||
      url.searchParams.size > 1 ||
      (socket !== null && !socket.startsWith('/'))
    ) {
      throw new Error('DEMO_DATABASE_URL debe apuntar a la base local legado_admin_demo.')
    }
    return url.toString()
  }

  const result = spawnSync(
    'docker',
    [
      'compose',
      '-p',
      'legado-admin-demo',
      '-f',
      'compose.admin-demo.yaml',
      'up',
      '-d',
      '--wait',
      'demo-db',
    ],
    { stdio: 'inherit' },
  )
  if (result.error || result.status !== 0) {
    throw new Error('No se pudo iniciar PostgreSQL de demostración con Docker Compose.')
  }
  const url = new URL('postgresql://legado_app@127.0.0.1:55448/legado_admin_demo')
  url.password = process.env.APP_DB_PASSWORD
  return url.toString()
}

function checkAvailablePort(port) {
  return new Promise((resolve, reject) => {
    const probe = createServer()
    probe.once('error', reject)
    probe.listen(port, host, () => probe.close(resolve))
  })
}

const children = new Set()
const stop = new AbortController()
function shutdown() {
  stop.abort()
  for (const child of children) child.kill('SIGTERM')
}

function serve(entry, env) {
  const child = spawn(process.execPath, [entry], {
    env: { ...process.env, BIND_HOST: host, ...env },
    stdio: 'inherit',
  })
  children.add(child)
  child.on('error', (error) => {
    console.error(error.message)
    process.exitCode = 1
    shutdown()
  })
  child.on('exit', () => {
    children.delete(child)
    if (stop.signal.aborted) return
    console.error('Se detuvo el proceso de demostración ' + entry + '.')
    process.exitCode = 1
    shutdown()
  })
}

async function waitFor(url) {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    stop.signal.throwIfAborted()
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1500) })
      await response.body?.cancel()
      if (response.ok) return
    } catch {
      // El servidor puede tardar en aplicar las migraciones o abrir el puerto.
    }
    await delay(200, undefined, { signal: stop.signal })
  }
  throw new Error('Tiempo de espera agotado al iniciar ' + url)
}

async function main() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_JWT_SECRET) {
    throw new Error('Ejecuta npm run pilot:init antes de abrir la demostración.')
  }
  await Promise.all([checkAvailablePort(apiPort), checkAvailablePort(panelPort)])
  const connectionString = demoDatabaseUrl()
  const pool = new pg.Pool({ connectionString, max: 1, connectionTimeoutMillis: 5000 })
  try {
    const { rows } = await pool.query('SELECT current_database() AS database')
    if (rows[0].database !== 'legado_admin_demo')
      throw new Error('Base de demostración incorrecta.')
    stop.signal.throwIfAborted()
    serve('dist/api/main.cjs', {
      DATABASE_URL: connectionString,
      PORT: String(apiPort),
      ADMIN_DISPLAY_NAME: 'Equipo demo',
      ADMIN_JWT_SECRET: createHmac('sha256', process.env.ADMIN_JWT_SECRET)
        .update('admin-demo')
        .digest('hex'),
    })
    await waitFor(apiOrigin + '/api/v1/health')
    await seedDemo(pool)
  } finally {
    await pool.end()
  }
  stop.signal.throwIfAborted()
  serve('apps/admin/server.mjs', {
    ADMIN_PORT: String(panelPort),
    ADMIN_ORIGIN: panelOrigin,
    API_ORIGIN: apiOrigin,
    ADMIN_COOKIE_PREFIX: 'legado_demo',
  })
  await waitFor('http://' + host + ':' + panelPort + '/admin/login')
  console.log('Panel con datos ficticios disponible en ' + panelOrigin + '/admin/')
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
main().catch((error) => {
  if (!stop.signal.aborted) {
    console.error(error.message)
    process.exitCode = 1
  }
  shutdown()
})
