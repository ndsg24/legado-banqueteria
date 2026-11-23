import assert from 'node:assert/strict'
import { randomInt, randomUUID } from 'node:crypto'
import { test } from 'node:test'

const api = process.env.TEST_API_URL || 'http://127.0.0.1:3000'
const origin = 'http://127.0.0.1:5185'
const id = randomUUID()
const quote = {
  event: 'wedding',
  name: 'Test customer',
  email: 'pilot@example.test',
  phone: '',
  date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  guests: 40,
  location: 'Concepción',
  items: { 'salados-1': 2 },
  dietaryCounts: { milk: 2 },
  table: null,
  notes: '',
}
function authenticate(action, body) {
  return fetch(api + '/api/v1/auth/' + action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
const account = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }
function bearer(token) {
  return { Authorization: 'Bearer ' + token }
}

function post(body, source = origin) {
  return fetch(api + '/api/v1/quotes', {
    method: 'POST',
    headers: { Origin: source, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

test('quote intake, concurrent retry and private history', async () => {
  const login = await authenticate('login', account)
  assert.equal(login.status, 200)
  const pair = await login.json()
  const auth = bearer(pair.accessToken)
  assert.equal((await fetch(api + '/api/v1/admin/quotes')).status, 401)
  assert.equal((await fetch(api + '/api/v1/admin/quotes/1')).status, 401)
  assert.equal((await post({ id, quote }, 'https://otro.example')).status, 403)
  assert.equal((await post({ id, quote: { ...quote, email: 'customer@example.com' } })).status, 422)
  assert.equal((await post({ id, quote: { ...quote, dietaryNeeds: 'Free text' } })).status, 422)
  const before = await (await fetch(api + '/api/v1/admin/quotes', { headers: auth })).json()
  const priorNumbers = new Set(before.items.map((row) => row.number))
  const replies = await Promise.all([post({ id, quote }), post({ id, quote })])
  for (const reply of replies) {
    assert.equal(reply.status, 202)
    assert.deepEqual(await reply.json(), { accepted: true })
  }
  assert.equal((await post({ id, quote: { ...quote, guests: 50 } })).status, 409)
  const listing = await fetch(api + '/api/v1/admin/quotes', { headers: auth })
  assert.equal(listing.status, 200)
  assert.equal(listing.headers.get('cache-control'), 'no-store')
  const page = await listing.json()
  const numbers = page.items.map((row) => row.number).filter((n) => !priorNumbers.has(n))
  assert.equal(
    page.items.some((row) => 'email' in row || 'payload' in row),
    false,
  )
  assert.equal(numbers.length, 1)
  const detail = await fetch(api + '/api/v1/admin/quotes/' + numbers[0], { headers: auth })
  const { payload } = await detail.json()
  assert.equal(payload.email, quote.email)
  assert.equal(payload.event, quote.event)
  const purchasing = api + '/api/v1/admin/purchasing'
  const range = '?from=' + quote.date + '&to=' + quote.date
  const inPurchasing = async () => {
    const response = await fetch(purchasing + range, { headers: auth })
    assert.equal(response.status, 200)
    return (await response.json()).events.some((event) => event.number === numbers[0])
  }
  assert.equal((await fetch(purchasing + range)).status, 401)
  assert.equal(
    (await fetch(purchasing + '?from=invalid&to=' + quote.date, { headers: auth })).status,
    400,
  )
  assert.equal(await inPurchasing(), false)
  const search = new URLSearchParams({ search: numbers[0], event: 'wedding', pageSize: '1' })
  const filtered = await fetch(api + '/api/v1/admin/quotes?' + search, { headers: auth })
  assert.equal((await filtered.json()).total, 1)
  assert.equal((await (await fetch(detail.url, { headers: auth })).json()).status, 'requested')
  const change = (expectedStatus, status, headers = auth) =>
    fetch(detail.url + '/status', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ expectedStatus, status }),
    })
  assert.equal((await change('requested', 'confirmed', {})).status, 401)
  assert.equal((await change('requested', 'invalid')).status, 400)
  const competing = await Promise.all([
    change('requested', 'confirmed'),
    change('requested', 'cancelled'),
  ])
  assert.deepEqual(competing.map((response) => response.status).sort(), [204, 409])
  const winner = (await (await fetch(detail.url, { headers: auth })).json()).status
  assert.equal((await change('requested', winner)).status, 204)
  assert.equal((await change(winner, 'cancelled')).status, 204)
  assert.equal(await inPurchasing(), false)
  const active = await fetch(api + '/api/v1/admin/quotes?' + search + '&status=active', {
    headers: auth,
  })
  assert.equal((await active.json()).total, 0)
  const cancelled = await fetch(api + '/api/v1/admin/quotes?' + search + '&status=cancelled', {
    headers: auth,
  })
  assert.equal((await cancelled.json()).items[0].status, 'cancelled')
  assert.equal((await change('cancelled', 'confirmed')).status, 204)
  assert.equal(await inPurchasing(), true)
  assert.equal((await change('confirmed', 'requested')).status, 204)
  search.set('event', 'corporate-event')
  const empty = await fetch(api + '/api/v1/admin/quotes?' + search, { headers: auth })
  assert.equal((await empty.json()).items.length, 0)
  await authenticate('logout', { refreshToken: pair.refreshToken })
})

test('rotation, replay detection and logout revoke the access token', async () => {
  const initial = await (await authenticate('login', account)).json()
  const renew = () => authenticate('refresh', { refreshToken: initial.refreshToken })
  const rotated = await renew()
  assert.equal(rotated.status, 200)
  const second = await rotated.json()
  assert.notEqual(initial.refreshToken, second.refreshToken)
  assert.equal((await renew()).status, 401)
  const session = (token) => fetch(api + '/api/v1/admin/session', { headers: bearer(token) })
  assert.equal((await session(second.accessToken)).status, 401)
  const fresh = await (await authenticate('login', account)).json()
  assert.equal((await session(fresh.accessToken)).status, 204)
  assert.equal((await authenticate('logout', { refreshToken: fresh.refreshToken })).status, 204)
  assert.equal((await session(fresh.accessToken)).status, 401)
})

test('ordered pages, inclusive date filters and daily event counts agree', async () => {
  const pair = await (await authenticate('login', account)).json()
  const read = (path) =>
    fetch(api + '/api/v1/admin/quotes' + path, { headers: bearer(pair.accessToken) })
  const month = quote.date.slice(0, 7)
  const list =
    '?from=' + quote.date + '&to=' + quote.date + '&status=active&sort=guests&direction=asc'
  try {
    assert.equal((await post({ id: randomUUID(), quote: { ...quote, guests: 105 } })).status, 202)
    assert.equal((await post({ id: randomUUID(), quote: { ...quote, guests: 45 } })).status, 202)
    const first = await (await read(list + '&pageSize=1')).json()
    const second = await (await read(list + '&pageSize=1&page=2')).json()
    assert.ok(first.total >= 2)
    assert.notEqual(first.items[0].number, second.items[0].number)
    assert.ok(Number(first.items[0].guests) <= Number(second.items[0].guests))
    const last = await (await read(list.replace('asc', 'desc') + '&pageSize=1')).json()
    assert.ok(Number(last.items[0].guests) >= 105)
    assert.equal(last.items[0].date, quote.date)
    const days = await (await read('/calendar?month=' + month)).json()
    const day = days.find((item) => item.date === quote.date)
    assert.equal(day.count, first.total)
    assert.ok(day.guests >= 150)
    assert.deepEqual(Object.keys(day).sort(), ['count', 'date', 'event', 'guests'])
    assert.equal((await read('?sort=unknown')).status, 400)
    assert.equal((await read('/calendar?month=bad')).status, 400)
  } finally {
    await authenticate('logout', { refreshToken: pair.refreshToken })
  }
})

test('concurrent confirmations reserve one day and releasing the winner makes that date available again', async () => {
  const availability = await fetch(api + '/api/v1/quotes/availability')
  assert.equal(availability.status, 200)
  const reserved = new Set((await availability.json()).unavailableDates)
  const dates = Array.from({ length: 290 }, (_, i) =>
    new Date(Date.now() + (31 + i) * 86400000).toISOString().slice(0, 10),
  ).filter((day) => !reserved.has(day))
  assert.ok(dates.length, 'The booking test needs an available future date')
  const date = dates[randomInt(dates.length)]
  const payload = { ...quote, date }
  const requests = Array.from({ length: 2 }, () => {
    const id = randomUUID()
    return { id, quote: { ...payload, email: id + '@example.test' } }
  })
  const pair = await (await authenticate('login', account)).json()
  const headers = bearer(pair.accessToken)
  const route = api + '/api/v1/admin/quotes'
  const booked = async () => {
    const response = await fetch(api + '/api/v1/quotes/availability')
    assert.equal(response.status, 200)
    return (await response.json()).unavailableDates.includes(date)
  }
  const detail = async (number) => (await fetch(route + '/' + number, { headers })).json()
  const change = (number, expectedStatus, status) =>
    fetch(route + '/' + number + '/status', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ expectedStatus, status }),
    })
  let numbers = []
  try {
    assert.equal(await booked(), false)
    for (const submitted of requests) assert.equal((await post(submitted)).status, 202)
    const emails = new Set(requests.map((submitted) => submitted.quote.email))
    const found = new Map()
    const filters = new URLSearchParams({ from: date, to: date, pageSize: '25' })
    do {
      const response = await fetch(route + '?' + filters, { headers })
      assert.equal(response.status, 200)
      const list = await response.json()
      for (const { number } of list.items) {
        const saved = await detail(number)
        if (saved.number === number && emails.has(saved.payload?.email))
          found.set(saved.payload.email, number)
        if (found.size === emails.size) break
      }
      if (!list.nextCursor) break
      filters.set('before', list.nextCursor)
    } while (found.size < emails.size)
    assert.equal(
      found.size,
      emails.size,
      'Both unique test requests must be identified before changing status',
    )
    numbers = [...found.values()]
    const responses = await Promise.all(numbers.map((n) => change(n, 'requested', 'confirmed')))
    assert.deepEqual(responses.map((r) => r.status).sort(), [204, 409])
    const [winner, loser] = responses[0].status === 204 ? numbers : [...numbers].reverse()
    assert.equal(
      (await responses.find((r) => r.status === 409).json()).code,
      'EVENT_DATE_UNAVAILABLE',
    )
    assert.equal(await booked(), true)
    assert.equal((await detail(winner)).dateBookedByAnotherEvent, false)
    assert.equal((await detail(loser)).status, 'requested')
    assert.equal((await detail(loser)).dateBookedByAnotherEvent, true)
    assert.equal((await change(winner, 'requested', 'confirmed')).status, 204)
    assert.equal((await post(requests[0])).status, 202)
    const newQuote = { id: randomUUID(), quote: payload }
    const unavailable = await post(newQuote)
    assert.equal(unavailable.status, 409)
    assert.equal((await unavailable.json()).code, 'EVENT_DATE_UNAVAILABLE')
    assert.equal((await change(winner, 'confirmed', 'requested')).status, 204)
    assert.equal(await booked(), false)
    assert.equal((await detail(loser)).dateBookedByAnotherEvent, false)
    assert.equal((await post(newQuote)).status, 202)
    assert.equal((await change(loser, 'requested', 'confirmed')).status, 204)
    assert.equal((await change(loser, 'confirmed', 'cancelled')).status, 204)
    assert.equal(await booked(), false)
  } finally {
    for (const number of numbers) await change(number, 'confirmed', 'cancelled')
    await authenticate('logout', { refreshToken: pair.refreshToken })
  }
})
