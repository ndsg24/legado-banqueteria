const api = new URL(process.env.API_ORIGIN || 'http://127.0.0.1:3000').origin
export const panelOrigin = new URL(process.env.ADMIN_ORIGIN || 'http://127.0.0.1:5186')
if (
  panelOrigin.protocol !== 'https:' &&
  !['localhost', '127.0.0.1', '[::1]'].includes(panelOrigin.hostname)
)
  throw new Error('Configure an HTTPS ADMIN_ORIGIN outside loopback.')

const cookieOptions = {
  path: '/admin',
  httpOnly: true,
  sameSite: 'strict',
  secure: panelOrigin.protocol === 'https:',
}
const cookiePrefix = process.env.ADMIN_COOKIE_PREFIX || 'legado'
const accessCookie = cookiePrefix + '_access'
const refreshCookie = cookiePrefix + '_refresh'
const pending = new Map()

function cookie(req, name) {
  const prefix = name + '='
  return (req.get('cookie') || '')
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length)
}
export function queryApi(path, access, body) {
  return fetch(new URL('/api/v1' + path, api), {
    method: body === undefined ? 'GET' : 'POST',
    body: JSON.stringify(body),
    headers: { Authorization: 'Bearer ' + access, 'Content-Type': 'application/json' },
    redirect: 'error',
    signal: AbortSignal.timeout(8000),
  })
}
function sendAuth(action, data) {
  return fetch(new URL('/api/v1/auth/' + action, api), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    redirect: 'error',
    signal: AbortSignal.timeout(8000),
  })
}
function writeCookies(res, pair) {
  res.cookie(accessCookie, pair.accessToken, { ...cookieOptions, maxAge: pair.expiresIn * 1000 })
  res.cookie(refreshCookie, pair.refreshToken, { ...cookieOptions, maxAge: 7 * 86400000 })
}
function clearCookies(res) {
  res.clearCookie(accessCookie, cookieOptions)
  res.clearCookie(refreshCookie, cookieOptions)
}
export async function login(req, res) {
  const result = await sendAuth('login', req.body)
  if (!result.ok) return res.sendStatus(result.status)
  writeCookies(res, await result.json())
  res.sendStatus(204)
}
export async function logout(req, res) {
  const refreshToken = cookie(req, refreshCookie)
  if (refreshToken) {
    const result = await sendAuth('logout', { refreshToken })
    if (!result.ok) return res.sendStatus(result.status)
  }
  clearCookies(res)
  res.sendStatus(204)
}
async function renew(refreshToken) {
  const result = await sendAuth('refresh', { refreshToken })
  if (result.status === 401 || result.status === 400) return null
  if (!result.ok) throw new Error('Refresh unavailable')
  return result.json()
}
export async function authorized(req, res, path, body) {
  const access = cookie(req, accessCookie)
  if (access) {
    const result = await queryApi(path, access, body)
    if (result.status !== 401) return result
  }
  const refresh = cookie(req, refreshCookie)
  if (!refresh) return new Response(null, { status: 401 })
  if (!pending.has(refresh))
    pending.set(
      refresh,
      renew(refresh).finally(() => pending.delete(refresh)),
    )
  const pair = await pending.get(refresh)
  if (!pair) {
    clearCookies(res)
    return new Response(null, { status: 401 })
  }
  writeCookies(res, pair)
  return queryApi(path, pair.accessToken, body)
}
