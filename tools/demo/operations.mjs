import { createHash } from 'node:crypto'
import { movementSchema } from '@legado/domain/operations/finance'
import { recipeSchema } from '@legado/domain/operations/recipes'

// Private kitchen yields per serving. Public menu descriptions and ingredients stay in the catalog.
const kitchenPortions = {
  'salados-1': [
    ['bread', 22, 'g'],
    ['vegetables', 4, 'g'],
    ['cheese', 7, 'g'],
    ['olive', 1, 'unit'],
  ],
  'salados-2': [
    ['bread', 14, 'g'],
    ['cheese', 7, 'g'],
    ['vegetables', 3, 'g'],
    ['tomato', 6, 'g'],
  ],
  'dulces-4': [
    ['flour', 8, 'g'],
    ['butter', 4, 'g'],
    ['cream', 8, 'ml'],
    ['seasonal-fruit', 12, 'g'],
  ],
  'aperitivos-1': [
    ['mango', 65, 'g'],
    ['pisco', 40, 'ml'],
    ['lemon', 18, 'g'],
    ['sugar', 8, 'g'],
  ],
  'entradas-1': [
    ['avocado', 85, 'g'],
    ['shrimp', 55, 'g'],
    ['mayonnaise', 10, 'g'],
    ['lemon', 6, 'g'],
  ],
  'entradas-7': [
    ['tomato', 1, 'unit'],
    ['chicken', 45, 'g'],
    ['mayonnaise', 12, 'g'],
    ['parsley', 2, 'g'],
  ],
  'principales-1': [
    ['beef', 210, 'g'],
    ['butter', 6, 'g'],
    ['garlic', 2, 'g'],
    ['salt', 1, 'g'],
  ],
  'principales-6': [
    ['salmon', 185, 'g'],
    ['oil', 6, 'ml'],
    ['lemon', 12, 'g'],
    ['salt', 1, 'g'],
  ],
  'guarniciones-1': [
    ['potato', 175, 'g'],
    ['oil', 8, 'ml'],
    ['parsley', 2, 'g'],
  ],
  'salsas-2': [
    ['milk', 40, 'ml'],
    ['butter', 3, 'g'],
    ['flour', 3, 'g'],
  ],
  'salsas-4': [
    ['mushroom', 18, 'g'],
    ['cream', 25, 'ml'],
    ['butter', 2, 'g'],
  ],
  'postres-1': [
    ['mascarpone', 40, 'g'],
    ['cream', 25, 'ml'],
    ['cookie', 2, 'unit'],
    ['coffee', 20, 'ml'],
    ['cocoa', 2, 'g'],
    ['sugar', 8, 'g'],
  ],
  'postres-6': [
    ['fruit', 100, 'g'],
    ['peaches', 40, 'g'],
    ['ice-cream', 35, 'g'],
  ],
  'nocturnos-1': [
    ['beef', 45, 'g'],
    ['stock', 140, 'ml'],
    ['onion', 8, 'g'],
    ['parsley', 1, 'g'],
  ],
}

const eventRate = {
  Matrimonio: 56000,
  'Encuentro familiar': 36500,
  'Evento de empresa': 42000,
  'Otra celebración': 39500,
}

function shiftDay(date, days) {
  const value = new Date(date + 'T12:00:00Z')
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

function money(amount) {
  return Math.round(amount / 100) * 100
}

function ledgerMovement(key, date, category, amount, quoteNumber = null) {
  const suffix = createHash('sha256')
    .update(key + '/' + category)
    .digest('hex')
    .slice(0, 12)
  return movementSchema.parse({
    id: '1d9c1ba8-9ea0-459e-a029-' + suffix,
    date,
    category,
    amount,
    quoteNumber,
  })
}

function eventMovements(quote, today) {
  const { date, event, guests } = quote.payload
  const sale = guests * eventRate[event]
  const deposit = money(sale * 0.35)
  const receivedOn = quote.receivedAt.slice(0, 10)
  const entry = (date, category, amount) =>
    ledgerMovement(
      quote.requestId,
      date < receivedOn ? receivedOn : date,
      category,
      amount,
      quote.number,
    )
  const entries = [entry(receivedOn, 'sale', sale), entry(receivedOn, 'deposit', deposit)]
  if (shiftDay(date, -10) <= today) {
    entries.push(entry(shiftDay(date, -10), 'rentals', money(sale * 0.065)))
  }
  if (shiftDay(date, -4) <= today) {
    entries.push(entry(shiftDay(date, -4), 'supplies', money(sale * 0.25)))
  }
  if (date <= today) {
    entries.push(
      entry(date, 'payment', sale - deposit),
      entry(date, 'staff', money(sale * 0.18)),
      entry(date, 'transport', money(32000 + guests * 240)),
    )
  }
  return entries
}

// General ledger entries also cover months outside the quote contact retention window.
function generalMovements(today) {
  const movements = [ledgerMovement('overhead/current', today, 'otherExpense', 48000)]
  for (const [monthsAgo, turnover] of [
    [1, 6180000],
    [2, 4720000],
  ]) {
    const period = new Date(today.slice(0, 7) + '-01T12:00:00Z')
    period.setUTCMonth(period.getUTCMonth() - monthsAgo)
    const month = period.toISOString().slice(0, 7)
    const entry = (day, category, amount) =>
      ledgerMovement('house/' + month, month + '-' + day, category, money(amount))
    movements.push(
      entry('04', 'sale', turnover),
      entry('05', 'deposit', turnover * 0.35),
      entry('12', 'rentals', turnover * 0.06),
      entry('19', 'supplies', turnover * 0.29),
      entry('21', 'payment', turnover * 0.65),
      entry('23', 'staff', turnover * 0.18),
      entry('24', 'transport', turnover * 0.027),
      entry('25', 'otherExpense', turnover * 0.012),
    )
  }
  return movements
}

export async function seedOperations(client, quotes, today) {
  const recipes = Object.entries(kitchenPortions).map(([dishId, ingredients]) =>
    recipeSchema.parse({
      dishId,
      revision: 1,
      lines: ingredients.map(([ingredient, amount, unit]) => ({ ingredient, amount, unit })),
    }),
  )
  const movements = [
    ...generalMovements(today),
    ...quotes
      .filter((quote) => quote.status === 'confirmed')
      .flatMap((quote) => eventMovements(quote, today)),
  ]
  await client.query(
    `INSERT INTO kitchen_recipes (dish_id, revision, lines)
     SELECT "dishId", revision, lines FROM jsonb_to_recordset($1::jsonb)
       AS r("dishId" text, revision integer, lines jsonb)
     ON CONFLICT (dish_id) DO NOTHING`,
    [JSON.stringify(recipes)],
  )
  await client.query(
    `INSERT INTO financial_movements (id, booked_on, category, amount, quote_number, event_reference)
     SELECT id, date, category, amount, "quoteNumber", "quoteNumber" FROM jsonb_to_recordset($1::jsonb)
       AS m(id uuid, date date, category text, amount integer, "quoteNumber" bigint)
     ON CONFLICT (id) DO NOTHING`,
    [JSON.stringify(movements)],
  )
  return { recipes: recipes.length, movements: movements.length }
}
