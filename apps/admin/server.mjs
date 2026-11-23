import express from 'express'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'
import { authorized, login, logout, panelOrigin } from './session.mjs'

const dist = fileURLToPath(new URL('../../dist/admin/', import.meta.url))
// Only files reached by the login entry may be served to an anonymous browser.
const manifest = JSON.parse(await readFile(join(dist, '.vite/manifest.json'), 'utf8'))
const publicFiles = new Set()
function include(key) {
  const entry = manifest[key]
  if (!entry || publicFiles.has(entry.file)) return
  for (const file of [entry.file, ...(entry.assets ?? []), ...(entry.css ?? [])])
    publicFiles.add(file)
  for (const dependency of [...(entry.imports ?? []), ...(entry.dynamicImports ?? [])])
    include(dependency)
}
include('login.html')
const app = express()
app.disable('x-powered-by')
app.use((_req, res, next) => {
  res.set({
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Robots-Tag': 'noindex, nofollow',
    'Content-Security-Policy':
      "default-src 'self'; img-src 'self' data:; object-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  })
  next()
})

app.get('/admin/login', (_req, res) => res.sendFile(join(dist, 'login.html')))
app.use(
  '/admin/auth',
  (req, res, next) => {
    if (req.get('origin') !== panelOrigin.origin || !req.is('application/json'))
      return res.sendStatus(403)
    next()
  },
  express.json({ limit: '4kb' }),
)
app.post('/admin/auth/login', login)
app.post('/admin/auth/logout', logout)
app.post(
  /^\/admin\/api\/v1\/(?:ledger|recipes|quotes\/[1-9]\d{0,17}\/status)$/,
  express.json({ limit: '4kb' }),
  async (req, res) => {
    if (req.get('origin') !== panelOrigin.origin || !req.is('application/json'))
      return res.sendStatus(403)
    if (!req.body) return res.sendStatus(400)
    const result = await authorized(
      req,
      res,
      req.path.replace('/admin/api/v1/', '/admin/'),
      req.body,
    )
    if (result.status === 409 && req.path.endsWith('/status')) {
      const problem = await result.json().catch(() => null)
      if (typeof problem?.code === 'string') return res.status(409).json({ code: problem.code })
    }
    res.sendStatus(result.status)
  },
)
app.get(
  /^\/admin\/api\/v1\/(?:profile|ledger|recipes|purchasing|quotes(?:\/(?:calendar|[1-9]\d{0,17}))?)$/,
  async (req, res) => {
    const path = req.originalUrl.replace('/admin/api/v1/', '/admin/')
    const result = await authorized(req, res, path)
    if (!result.ok) return res.sendStatus(result.status)
    res.json(await result.json())
  },
)
const adminView =
  /^\/admin(?:\/(?:quotes|calendar|finance|purchasing|recipes|content|preparation(?:\/[1-9]\d{0,17})?|[1-9]\d{0,17}))?\/?$/
app.use('/admin', async (req, res, next) => {
  if (publicFiles.has(req.path.slice(1))) return next()
  const result = await authorized(req, res, '/admin/session')
  if (result.status === 401 && adminView.test(req.baseUrl + req.path))
    return res.redirect(303, '/admin/login?next=' + encodeURIComponent(req.originalUrl))
  if (!result.ok) return res.sendStatus(result.status)
  next()
})
app.use(
  '/admin/assets',
  express.static(join(dist, 'assets'), { index: false, cacheControl: false }),
)
app.get(adminView, (_req, res) => res.sendFile(join(dist, 'index.html')))
app.use((_error, _req, res, _next) => res.sendStatus(503))
app.listen(Number(process.env.ADMIN_PORT || 5186), process.env.BIND_HOST || '127.0.0.1')
