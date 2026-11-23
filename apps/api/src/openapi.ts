import type { Express } from 'express'
import { dirname, join } from 'node:path'
import { json, object } from './shared'
import { identityPaths } from './identity'
import { financePaths } from './finance'
import { kitchenPaths } from './kitchen'
import { quotePaths, quoteSchemas } from './quotes'
const spec = {
  openapi: '3.1.0',
  info: {
    title: 'Legado API',
    version: '1.0.0',
    description: 'Local catering operations pilot. Use fictional data.',
  },
  servers: [{ url: '/api/v1' }],
  components: {
    securitySchemes: { adminBearer: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: quoteSchemas,
  },
  paths: {
    ...identityPaths,
    ...quotePaths,
    ...financePaths,
    ...kitchenPaths,
    '/health': {
      get: {
        operationId: 'checkHealth',
        summary: 'Check database readiness',
        responses: {
          200: { description: 'Ready', content: json(object({ ready: { const: true } })) },
          500: { description: 'Database check failed.' },
        },
      },
    },
  },
}
export function installDocs(server: Express) {
  const base = '/api/v1/docs'
  const assets = dirname(require.resolve('swagger-ui-dist/package.json'))
  server.get('/api/v1/openapi.json', (_req, res) => res.json(spec))
  server.use(base, (_req, res, next) => {
    res.set(
      'Content-Security-Policy',
      "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; " +
        "object-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    )
    next()
  })
  for (const file of ['swagger-ui.css', 'swagger-ui-bundle.js']) {
    server.get(base + '/' + file, (_req, res) => res.sendFile(join(assets, file)))
  }
  server.get(base + '/init.js', (_req, res) =>
    res
      .type('js')
      .send("SwaggerUIBundle({url:'/api/v1/openapi.json',dom_id:'#swagger-ui',validatorUrl:null})"),
  )
  server.get(base, (_req, res) =>
    res
      .type('html')
      .send(
        '<!doctype html><html lang="en"><meta charset="utf-8"><title>Legado API v1</title>' +
          '<meta name="viewport" content="width=device-width,initial-scale=1">' +
          '<link rel="stylesheet" href="' +
          base +
          '/swagger-ui.css"><div id="swagger-ui"></div>' +
          '<script src="' +
          base +
          '/swagger-ui-bundle.js"></script><script src="' +
          base +
          '/init.js"></script></html>',
      ),
  )
}
