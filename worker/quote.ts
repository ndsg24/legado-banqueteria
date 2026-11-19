import { migrateBottleOutfit, floralDefaults, defaultLayout } from '../src/entities/table'
import { z } from 'zod'
import { quoteMessage, quoteSchema } from '../src/entities/quote'

interface Environment {
  SITE_ORIGIN: string
  RESEND_API_KEY: string
  MAIL_FROM: string
  MAIL_TO: string
  QUOTE_LIMIT: { limit(input: { key: string }): Promise<{ success: boolean }> }
}

// Normalize payloads from clients predating quantities or the seating plan.
const incomingQuote = z.preprocess((quote) => {
  if (!quote || typeof quote !== 'object' || !('items' in quote)) return quote
  const { items } = quote
  const table = 'table' in quote ? quote.table : undefined
  return {
    ...quote,
    items:
      Array.isArray(items) && items.every((id) => typeof id === 'string')
        ? Object.fromEntries(items.map((id) => [id, 1]))
        : items,
    table:
      table && typeof table === 'object'
        ? {
            ...defaultLayout,
            ...floralDefaults,
            napkinFold: 'flat',
            overlayStyle: 'traditional',
            ...table,
            bottleOutfit: migrateBottleOutfit(
              'bottleOutfit' in table ? table.bottleOutfit : undefined,
              'floral' in table ? table.floral : undefined,
            ),
          }
        : table,
  }
}, quoteSchema)
const envelope = z.strictObject({ id: z.uuid(), quote: incomingQuote })
const maxBytes = 16_384
const securityHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
}

async function readBody(request: Request) {
  const reader = request.body?.getReader()
  if (!reader) return null
  const decoder = new TextDecoder()
  let size = 0
  let json = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.length
    if (size > maxBytes) {
      await reader.cancel()
      throw new RangeError()
    }
    json += decoder.decode(value, { stream: true })
  }
  return JSON.parse(json + decoder.decode()) as unknown
}

export default {
  async fetch(request: Request, env: Environment): Promise<Response> {
    if (new URL(request.url).pathname !== '/cotizaciones')
      return new Response(null, { status: 404, headers: securityHeaders })
    if (request.headers.get('Origin') !== env.SITE_ORIGIN)
      return new Response(null, { status: 403, headers: securityHeaders })
    const headers = {
      'Access-Control-Allow-Origin': env.SITE_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...securityHeaders,
      Vary: 'Origin',
    }
    const reply = (status: number) =>
      Response.json({ accepted: status === 202 }, { status, headers })
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })
    if (request.method !== 'POST') return reply(405)
    if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json')
      return reply(415)
    if (!env.MAIL_FROM || !env.MAIL_TO || !env.RESEND_API_KEY) {
      console.error({ event: 'quote_config_missing' })
      return reply(503)
    }

    try {
      const { success } = await env.QUOTE_LIMIT.limit({
        key: request.headers.get('CF-Connecting-IP') || 'unknown',
      })
      if (!success) {
        console.warn({ event: 'quote_rate_limited' })
        const response = reply(429)
        response.headers.set('Retry-After', '60')
        return response
      }
    } catch {
      console.error({ event: 'quote_limit_unavailable' })
      return reply(503)
    }
    let body: unknown
    try {
      body = await readBody(request)
    } catch (error) {
      return reply(error instanceof RangeError ? 413 : 400)
    }
    const result = envelope.safeParse(body)
    if (!result.success) return reply(422)
    const { id, quote } = result.data
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + env.RESEND_API_KEY,
          'Content-Type': 'application/json',
          'Idempotency-Key': 'quote/' + id,
        },
        body: JSON.stringify({
          from: env.MAIL_FROM,
          to: [env.MAIL_TO],
          reply_to: quote.email,
          subject: [
            'Cotización Legado',
            quote.event,
            quote.date || 'Fecha por definir',
            quote.guests + ' invitados',
          ].join(' · '),
          text: quoteMessage(quote),
        }),
        redirect: 'error',
        signal: AbortSignal.timeout(12000),
      })
      if (!response.ok) {
        console.error({ event: 'quote_mail_rejected', status: response.status })
        return reply(502)
      }
      return reply(202)
    } catch {
      console.error({ event: 'quote_mail_unavailable' })
      return reply(503)
    }
  },
}
