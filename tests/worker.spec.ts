import { test, expect } from '@playwright/test'
import worker from '../worker/quote'
import { eventDateRange } from '../src/entities/quote'

const origin = 'https://legado.example'
const env = {
  SITE_ORIGIN: origin,
  MAIL_TO: 'cocina@example.org',
  MAIL_FROM: 'web@example.org',
  RESEND_API_KEY: 'test-only',
  QUOTE_LIMIT: { limit: async () => ({ success: true }) },
}
function request(body: string, source = origin) {
  return new Request('https://worker.example/cotizaciones', {
    method: 'POST',
    headers: { Origin: source, 'Content-Type': 'application/json' },
    body,
  })
}

test('el Worker limita el acceso y valida antes de enviar correo', async () => {
  const denied = await worker.fetch(request('{}', 'https://otro.example'), env)
  expect(denied.status).toBe(403)
  expect(denied.headers.get('Access-Control-Allow-Origin')).toBeNull()
  expect((await worker.fetch(request('{'), env)).status).toBe(400)
  expect((await worker.fetch(request('{}'), env)).status).toBe(422)
  expect((await worker.fetch(request(' '.repeat(16_385)), env)).status).toBe(413)
  const limited = await worker.fetch(request('{}'), {
    ...env,
    QUOTE_LIMIT: { limit: async () => ({ success: false }) },
  })
  expect(limited.status).toBe(429)
  expect(limited.headers.get('Retry-After')).toBe('60')
  const unavailable = await worker.fetch(request('{}'), {
    ...env,
    QUOTE_LIMIT: {
      limit: async () => {
        throw new Error('simulated')
      },
    },
  })
  expect(unavailable.status).toBe(503)
  expect(await unavailable.json()).toEqual({ accepted: false })
})

test('el correo usa un destino fijo y trata las fallas del proveedor', async () => {
  const id = crypto.randomUUID()
  const quote = {
    name: 'Prueba local',
    email: 'cliente@example.org',
    phone: '',
    event: 'Matrimonio',
    date: eventDateRange().first.toString(),
    guests: 42,
    location: 'Concepción',
    items: {},
    notes: '',
    table: null,
  }
  const body = JSON.stringify({ id, quote })
  const original = globalThis.fetch
  const calls: Request[] = []
  try {
    globalThis.fetch = async (url, options) => {
      calls.push(new Request(url, options))
      return new Response(null, { status: calls.length === 1 ? 200 : 503 })
    }
    const accepted = await worker.fetch(request(body), env)
    expect(accepted.status).toBe(202)
    expect(accepted.headers.get('Cache-Control')).toBe('no-store')
    expect(calls[0].url).toBe('https://api.resend.com/emails')
    expect(calls[0].headers.get('Idempotency-Key')).toBe('quote/' + id)
    expect((await calls[0].json()).to).toEqual([env.MAIL_TO])
    expect((await worker.fetch(request(body), env)).status).toBe(502)
    globalThis.fetch = async () => {
      throw new Error('simulated')
    }
    expect((await worker.fetch(request(body), env)).status).toBe(503)
  } finally {
    globalThis.fetch = original
  }
})
