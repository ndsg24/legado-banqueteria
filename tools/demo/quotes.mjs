import { createHash } from 'node:crypto'
import { parseDate, Time, toCalendarDateTime } from '@internationalized/date'
import { z } from 'zod'
import { eventDateRange, eventTimeZone } from '@legado/domain/quote/dates'
import { quoteSchema } from '@legado/domain/quote/request'
import { tablePresets, totalSeats } from '@legado/domain/table/options'

const wedding = {
  event: 'Matrimonio',
  preset: 'romance',
  headSeats: 8,
  setting: {
    overlayStyle: 'runner',
    napkinFold: 'crown',
    flowerKind: 'rose',
    flowerColor: 'ivory',
  },
  items: {
    'salados-2': 2,
    'salados-5': 1,
    'dulces-2': 1,
    'aperitivos-1': 1,
    'aperitivos-6': 1,
    'entradas-1': 1,
    'principales-1': 1,
    'principales-6': 1,
    'guarniciones-1': 1,
    'guarniciones-4': 1,
    'postres-1': 1,
    'bajativos-1': 1,
    'nocturnos-1': 1,
    'bar-5': 1,
    'bar-8': 1,
  },
  sauces: { 'principales-1': 'salsas-4', 'principales-6': 'salsas-8' },
  omittedIngredients: { 'salados-5': ['menu.ingredients.ham'] },
  dietaryCounts: { crustaceans: 2, gluten: 3, vegetarian: 4 },
}

const family = {
  event: 'Encuentro familiar',
  preset: 'natural',
  setting: { floral: 'harvest', napkinFold: 'fan', dinnerware: 'porcelain' },
  items: {
    'salados-1': 2,
    'dulces-5': 1,
    'aperitivos-7': 1,
    'entradas-2': 1,
    'principales-2': 1,
    'guarniciones-2': 1,
    'postres-4': 1,
    'bar-5': 1,
  },
  sauces: { 'principales-2': 'salsas-1' },
  dietaryCounts: { milk: 1, light: 2 },
}

const corporate = {
  event: 'Evento de empresa',
  preset: 'night',
  setting: { floral: 'botanical', overlayStyle: 'runner', dinnerware: 'stoneware' },
  items: {
    'salados-3': 2,
    'salados-5': 1,
    'aperitivos-6': 1,
    'entradas-7': 1,
    'principales-8': 1,
    'guarniciones-5': 1,
    'postres-6': 1,
    'bar-4': 1,
  },
  sauces: { 'principales-8': 'salsas-2' },
  dietaryCounts: { lactose: 2, vegan: 3 },
}

const celebration = {
  event: 'Otra celebración',
  preset: 'classic',
  setting: { floral: 'burgundy', overlay: 'wine', sash: 'wine', napkinFold: 'doubleV' },
  items: {
    'salados-2': 2,
    'dulces-2': 2,
    'aperitivos-2': 1,
    'entradas-2': 1,
    'principales-8': 1,
    'guarniciones-2': 1,
    'postres-4': 1,
    'bar-8': 1,
  },
  sauces: { 'principales-8': 'salsas-2' },
  dietaryCounts: { egg: 1, vegetarian: 2 },
}

const cocktail = {
  ...corporate,
  items: { 'salados-3': 2, 'extras-2': 1, 'dulces-3': 1, 'aperitivos-3': 1, 'bar-5': 1 },
  sauces: {},
}

// Event dates are offsets from the first demo launch. Receipts stay inside the pilot's 30-day retention.
function occasion(key, name, menu, location, guests, eventDay, daysSinceReceipt, status) {
  return { key, name, menu, location, guests, eventDay, daysSinceReceipt, status }
}

const occasions = [
  occasion('boldo', 'Olivia Prado', family, 'Laja', 36, -15, 28, 'confirmed'),
  occasion('luma', 'Gaspar Novoa', corporate, 'Talcahuano', 94, -10, 26, 'confirmed'),
  occasion('huerta', 'Alma Leiva', celebration, 'Florida', 48, -8, 25, 'cancelled'),
  occasion('avellano', 'Renato Vila', wedding, 'Hualqui', 120, -7, 24, 'confirmed'),
  occasion('mimbre', 'Elisa Lago', family, 'Tomé', 54, -3, 21, 'confirmed'),
  occasion('lenga', 'Pablo Retamal', wedding, 'Concepción', 104, 19, 20, 'confirmed'),
  occasion('azahar', 'Amelia del Río', wedding, 'San Pedro de la Paz', 88, 1, 19, 'confirmed'),
  occasion('brisa', 'Rocío Jara', corporate, 'Penco', 60, 4, 18, 'requested'),
  occasion('aromo', 'Rafael Lira', family, 'Cabrero', 42, 8, 17, 'requested'),
  occasion('caleta', 'Inés Plaza', corporate, 'Penco', 76, 4, 16, 'confirmed'),
  occasion('huella', 'Ramón Vial', celebration, 'Mulchén', 64, 5, 15, 'cancelled'),
  occasion('litoral', 'Luz Correa', wedding, 'Tomé', 136, 13, 14, 'confirmed'),
  occasion('tilo', 'Lucas Soto', family, 'San Pedro de la Paz', 45, 6, 13, 'confirmed'),
  occasion('quillay', 'Alicia Pino', corporate, 'Concepción', 82, 12, 12, 'requested'),
  occasion('encina', 'Félix Rosas', celebration, 'Los Ángeles', 66, 10, 11, 'confirmed'),
  occasion('trébol', 'Isidora Gil', family, 'Chiguayante', 52, 8, 10, 'requested'),
  occasion('canelo', 'León Segura', wedding, 'Santa Juana', 144, 34, 9, 'requested'),
  occasion('tamarugo', 'Ingrid Farías', cocktail, 'Coronel', 90, 16, 8, 'requested'),
  occasion('parra', 'Benicio Mora', family, 'Yumbel', 32, 21, 7, 'cancelled'),
  occasion('cobre', 'Teresa Vera', celebration, 'Hualpén', 58, 24, 6, 'requested'),
  occasion('vega', 'Samuel Díaz', corporate, 'Lota', 72, 26, 5, 'confirmed'),
  occasion('dalia', 'Martina Luna', wedding, 'Los Ángeles', 112, 42, 5, 'requested'),
  occasion('copihue', 'Diego Solar', celebration, 'Santa Bárbara', 56, 11, 4, 'requested'),
  occasion('arrayán', 'Clara Ríos', family, 'Arauco', 38, 17, 3, 'requested'),
  occasion('helecho', 'Matías Cid', corporate, 'San Pedro de la Paz', 98, 32, 2, 'cancelled'),
  occasion('peumo', 'Valentina Solís', cocktail, 'Hualpén', 70, 23, 1, 'requested'),
]

function tableFor(menu, guests) {
  const { design } = tablePresets.find(({ id }) => id === menu.preset)
  const headSeats = menu.headSeats ?? 0
  const remaining = guests - headSeats
  const roundTables = Math.ceil(remaining / 9)
  const chairs = Math.floor(remaining / roundTables)
  const extra = remaining % roundTables
  const roundSeats = Array.from({ length: roundTables }, (_, i) => chairs + Number(i < extra))
  return { ...design, ...menu.setting, chairs, roundTables, roundSeats, headSeats }
}

// UUIDv5 identifiers use a namespace reserved for the demo and keep joins stable across runs.
function requestIdFor(key) {
  const namespace = Buffer.from('639545d002c541f3bd8844eda63fb087', 'hex')
  const digest = createHash('sha1').update(namespace).update(key).digest()
  digest[6] = (digest[6] & 15) | 80
  digest[8] = (digest[8] & 63) | 128
  const hex = digest.subarray(0, 16).toString('hex')
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-')
}

export function demoQuotes(anchorDate) {
  const anchor = parseDate(anchorDate)
  return occasions.map(
    ({ key, name, menu, location, guests, eventDay, daysSinceReceipt, status }) => {
      const received = anchor.subtract({ days: daysSinceReceipt })
      const { first, last } = eventDateRange(received)
      // Historical bookings were valid on their receipt date. Apply the public date window as of that day.
      const historicalSchema = quoteSchema.safeExtend({
        date: z.iso.date().refine((date) => date >= first.toString() && date <= last.toString()),
      })
      const emailKey = key.normalize('NFD').replace(/\p{Mark}/gu, '')
      const payload = historicalSchema.parse({
        name,
        location,
        guests,
        date: anchor.add({ days: eventDay }).toString(),
        event: menu.event,
        email: 'demo.' + emailKey + '@example.test',
        phone: '',
        notes: '',
        items: menu.items,
        sauces: menu.sauces,
        omittedIngredients: menu.omittedIngredients ?? {},
        dietaryCounts: menu.dietaryCounts,
        table: tableFor(menu, guests),
      })
      if (totalSeats(payload.table) !== guests) throw new Error('Invalid demo seat count: ' + key)
      return {
        key,
        requestId: requestIdFor(key),
        status,
        payload,
        receivedAt: toCalendarDateTime(received, new Time(9 + ((eventDay + 24) % 10), guests % 60))
          .toDate(eventTimeZone)
          .toISOString(),
      }
    },
  )
}

export async function seedQuotes(client, anchorDate) {
  const rows = []
  for (const quote of demoQuotes(anchorDate)) {
    const { key, requestId, status, payload, receivedAt } = quote
    await client.query(
      `INSERT INTO quotes(request_id, received_at, status, payload)
       VALUES ($1, $2, $3, $4::jsonb) ON CONFLICT (request_id) DO NOTHING`,
      [requestId, receivedAt, status, JSON.stringify(payload)],
    )
    const {
      rows: [saved],
    } = await client.query(
      'SELECT number::text, status, payload, received_at FROM quotes WHERE request_id = $1',
      [requestId],
    )
    rows.push({
      key,
      requestId,
      number: saved.number,
      status: saved.status,
      payload: saved.payload,
      receivedAt: saved.received_at.toISOString(),
    })
  }
  return rows
}
