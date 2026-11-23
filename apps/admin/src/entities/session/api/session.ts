export type Profile = { displayName: string; email: string }
export type Credentials = { email: string; password: string }

function postSession(action: 'login' | 'logout', body: Credentials | Record<string, never>) {
  return fetch('/admin/auth/' + action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function signIn(credentials: Credentials) {
  return postSession('login', credentials)
}

export function signOut() {
  return postSession('logout', {})
}
