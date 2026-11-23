import { VersioningType, type INestApplication } from '@nestjs/common'
import type { CorsOptionsCallback } from '@nestjs/common/interfaces/external/cors-options.interface'
import express from 'express'
import { quoteAvailabilityPath } from '@legado/domain/quote/availability'
import { rateLimit } from 'express-rate-limit'
import { installDocs } from './openapi'
import type { QueryBus } from '@nestjs/cqrs'
import { requireAdminSession } from './identity'
import { demoOrigin } from './shared'

export function configureHttp(app: INestApplication, queries: QueryBus) {
  app.setGlobalPrefix('api')
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })
  const server = app.getHttpAdapter().getInstance() as express.Express
  server.disable('x-powered-by')
  server.use((_req, res, next) => {
    res.set({
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy':
        "default-src 'none'; style-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'none'",
    })
    next()
  })
  server.use(
    '/api/v1/auth/login',
    rateLimit({ windowMs: 60000, limit: 12, skipSuccessfulRequests: true }),
  )
  server.use('/api/v1/auth', express.json({ limit: '4kb', inflate: false }))
  server.use('/api/v1/admin', requireAdminSession(queries))
  server.use(
    [
      '/api/v1/admin/ledger',
      '/api/v1/admin/recipes',
      /^\/api\/v1\/admin\/quotes\/[1-9]\d{0,17}\/status$/,
    ],
    express.json({ limit: '4kb', inflate: false }),
  )
  // Keep bookmarks from the original server-rendered panel.
  server.get(/^\/admin(?:\/[1-9]\d{0,17})?\/?$/, (req, res) => {
    const target = new URL(req.originalUrl, process.env.ADMIN_ORIGIN || 'http://127.0.0.1:5186')
    res.redirect(302, target.href)
  })
  // Only the dates endpoint is public across origins. Intake keeps the pilot origin policy.
  app.enableCors((req: express.Request, cb: CorsOptionsCallback) => {
    const availability = req.path === quoteAvailabilityPath
    cb(null, {
      origin: availability ? '*' : demoOrigin,
      methods: availability ? ['GET'] : ['POST'],
      allowedHeaders: ['Content-Type'],
    })
  })
  server.get(quoteAvailabilityPath, rateLimit({ windowMs: 60000, limit: 120 }))
  server.post('/api/v1/quotes', rateLimit({ windowMs: 60000, limit: 15 }))
  server.use('/api/v1/quotes', express.json({ limit: '16kb', inflate: false }))
  installDocs(server)
}
