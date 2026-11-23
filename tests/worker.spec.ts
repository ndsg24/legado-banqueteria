import { test, expect } from '@playwright/test'
import worker from '../worker/quote'
import { eventDateRange } from '@legado/domain/quote/dates'
import { eventDateUnavailableCode, quoteAvailabilityPath } from '@legado/domain/quote/availability'

const origin = 'https://legado.example'
const env = {
  SITE_ORIGIN: origin,
  BOOKING_API_ORIGIN: 'https://bookings.example',
  MAIL_TO: 'cocina@example.org',
  MAIL_FROM: 'web@example.org',
  RESEND_API_KEY: 'test-only',
  QUOTE_LIMIT: { limit: async () => ({ success: true }) },
}
function request(body: string, source = origin) {
  return new Request('https://worker.example/api/v1/quotes', {
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
    event: 'wedding',
    date: eventDateRange().first.toString(),
    guests: 42,
    location: 'Concepción',
    items: {
      'postres-1': 1,
      'nocturnos-1': 1,
      'principales-1': 1,
      'principales-2': 1,
      'guarniciones-1': 1,
      'guarniciones-2': 1,
      'aperitivos-1': 1,
      'aperitivos-3': 1,
      'aperitivos-6': 1,
      'aperitivos-7': 1,
      'aperitivos-8': 1,
      'aperitivos-10': 1,
    },
    omittedIngredients: { 'guarniciones-2': ['menu.ingredients.parsley'] },
    allergens: ['wheat', 'nuts'],
    dietaryCounts: { lactose: 3, vegan: 1 },
    dietaryNeeds: 'Una invitada con alergia a las nueces',
    notes: '',
    table: null,
  }
  const body = JSON.stringify({ id, quote })
  const original = globalThis.fetch
  const calls: Request[] = []
  let dates: string[] = []
  try {
    globalThis.fetch = async (url, options) => {
      const outgoing = new Request(url, options)
      if (outgoing.url === env.BOOKING_API_ORIGIN + quoteAvailabilityPath) {
        expect(outgoing.method).toBe('GET')
        expect(outgoing.body).toBeNull()
        expect(outgoing.headers.get('Authorization')).toBeNull()
        return Response.json({ unavailableDates: dates })
      }
      calls.push(outgoing)
      return new Response(null, { status: calls.length === 1 ? 200 : 503 })
    }
    for (const phone of ['+569', '+5691234567', '+569123456789', '+12345678901']) {
      const invalid = JSON.stringify({ id, quote: { ...quote, phone } })
      expect((await worker.fetch(request(invalid), env)).status).toBe(422)
    }
    for (const dietaryCounts of [{ milk: 43 }, { milk: 0 }, { light: 1.5 }]) {
      const invalid = JSON.stringify({ id, quote: { ...quote, dietaryCounts } })
      expect((await worker.fetch(request(invalid), env)).status).toBe(422)
    }
    for (const extra of [
      'principales-3',
      'guarniciones-3',
      'aperitivos-4',
      'postres-2',
      'nocturnos-2',
    ]) {
      const items = { ...quote.items, [extra]: 1 }
      const invalid = JSON.stringify({ id, quote: { ...quote, items } })
      expect((await worker.fetch(request(invalid), env)).status).toBe(422)
    }
    for (const dish of ['guarniciones-1', 'guarniciones-3']) {
      const omittedIngredients = { [dish]: ['menu.ingredients.parsley'] }
      const invalid = JSON.stringify({ id, quote: { ...quote, omittedIngredients } })
      expect((await worker.fetch(request(invalid), env)).status).toBe(422)
    }
    dates = [quote.date]
    const occupied = await worker.fetch(request(body), env)
    expect(occupied.status).toBe(409)
    expect(await occupied.json()).toEqual({ accepted: false, code: eventDateUnavailableCode })
    expect(calls).toEqual([])
    dates = []
    const accepted = await worker.fetch(request(body), env)
    expect(accepted.status).toBe(202)
    expect(accepted.headers.get('Cache-Control')).toBe('no-store')
    expect(calls[0].url).toBe('https://api.resend.com/emails')
    expect(calls[0].headers.get('Idempotency-Key')).toBe('quote/' + id)
    const email = await calls[0].json()
    expect(email.text).toContain('Sin Perejil')
    expect(email.to).toEqual([env.MAIL_TO])
    expect(email.text).toContain(
      'Trigo, Frutos secos\nSin lactosa · 3 personas\nVegano · 1 persona\n' + quote.dietaryNeeds,
    )
    expect((await worker.fetch(request(body), env)).status).toBe(502)
    globalThis.fetch = async (url) => {
      if (String(url) === env.BOOKING_API_ORIGIN + quoteAvailabilityPath) {
        return Response.json({ unavailableDates: [] })
      }
      throw new Error('simulated email provider outage')
    }
    expect((await worker.fetch(request(body), env)).status).toBe(503)
    const attempted: string[] = []
    globalThis.fetch = async (url) => {
      attempted.push(String(url))
      return new Response(null, { status: 503 })
    }
    expect((await worker.fetch(request(body), env)).status).toBe(503)
    expect(attempted).toEqual([env.BOOKING_API_ORIGIN + quoteAvailabilityPath])
  } finally {
    globalThis.fetch = original
  }
})

test('el Worker publica las fechas ocupadas y reporta si falla la agenda', async () => {
  const get = (source = origin, method = 'GET') =>
    new Request('https://worker.example' + quoteAvailabilityPath, {
      method,
      headers: { Origin: source },
    })
  const day = eventDateRange().last.toString()
  const upstream = globalThis.fetch
  try {
    globalThis.fetch = async () => Response.json({ unavailableDates: [day] })
    expect((await worker.fetch(get('https://other.example'), env)).status).toBe(403)
    const preflight = await worker.fetch(get(origin, 'OPTIONS'), env)
    expect(preflight.headers.get('Access-Control-Allow-Methods')).toContain('GET')
    const sameOrigin = new Request('https://worker.example' + quoteAvailabilityPath)
    expect((await worker.fetch(sameOrigin, env)).status).toBe(200)
    const calendar = await worker.fetch(get(), env)
    expect(calendar.status).toBe(200)
    expect(calendar.headers.get('Access-Control-Allow-Origin')).toBe(origin)
    expect(calendar.headers.get('Cache-Control')).toBe('no-store')
    expect(await calendar.json()).toEqual({ unavailableDates: [day] })
    expect((await worker.fetch(get(), { ...env, BOOKING_API_ORIGIN: undefined })).status).toBe(503)
    globalThis.fetch = async () => Response.json({ unavailableDates: [day], name: 'Private' })
    expect((await worker.fetch(get(), env)).status).toBe(503)
    globalThis.fetch = async () => new Response(null, { status: 503 })
    expect((await worker.fetch(get(), env)).status).toBe(503)
  } finally {
    globalThis.fetch = upstream
  }
})
