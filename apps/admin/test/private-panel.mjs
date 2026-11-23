import assert from 'node:assert/strict'
import { test } from 'node:test'
const origin = process.env.TEST_ADMIN_URL || 'http://127.0.0.1:5186'
const headers = { Origin: origin, 'Content-Type': 'application/json' }
const account = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }
test('only the login and its assets are public; the proxy rotates HttpOnly cookies', async () => {
  const get = (path, cookie = '') =>
    fetch(origin + path, { headers: { cookie }, redirect: 'manual' })
  assert.equal((await get('/admin/')).status, 303)
  assert.equal((await get('/admin/login')).status, 200)
  assert.equal((await get('/admin/api/v1/quotes')).status, 401)
  assert.equal((await get('/admin/api/v1/profile')).status, 401)
  const send = (action, data, extra) =>
    fetch(origin + '/admin/auth/' + action, {
      method: 'POST',
      headers: { ...headers, ...extra },
      body: JSON.stringify(data),
    })
  assert.equal((await send('login', account, { Origin: 'https://other.example' })).status, 403)
  const reply = await send('login', account)
  assert.equal(reply.status, 204)
  const cookies = reply.headers.getSetCookie()
  assert.ok(
    cookies.every((value) => value.includes('HttpOnly') && value.includes('SameSite=Strict')),
  )
  const refresh = cookies.find((value) => value.startsWith('legado_refresh=')).split(';')[0]
  const renewed = await get('/admin/', refresh)
  assert.equal(renewed.status, 200)
  const token = renewed.headers
    .getSetCookie()
    .map((value) => value.split(';')[0])
    .join('; ')
  const script = (await renewed.text()).match(/src="(\/admin\/assets\/[^"]+\.js)"/)?.[1]
  assert.ok(script)
  assert.equal((await get(script)).status, 401)
  assert.equal((await get(script, token)).status, 200)
  assert.equal((await get('/admin/api/v1/quotes', token)).status, 200)
  const profile = await (await get('/admin/api/v1/profile', token)).json()
  assert.deepEqual(Object.keys(profile).sort(), ['displayName', 'email'])
  assert.equal(profile.email, account.email.toLowerCase())
  assert.ok(profile.displayName.length > 0)
  assert.equal((await send('logout', {}, { cookie: token })).status, 204)
  assert.equal((await get('/admin/api/v1/quotes', token)).status, 401)
})
