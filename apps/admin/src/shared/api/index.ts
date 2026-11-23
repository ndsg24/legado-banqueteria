export async function readAdminApi(path: string, signal: AbortSignal) {
  const response = await fetch('/admin/api/v1/' + path, {
    signal,
    credentials: 'same-origin',
  })
  if (response.status === 401)
    location.replace(
      '/admin/login?next=' +
        encodeURIComponent(location.pathname + location.search + location.hash),
    )
  if (!response.ok) throw new Response(null, { status: response.status })
  return response.json()
}
