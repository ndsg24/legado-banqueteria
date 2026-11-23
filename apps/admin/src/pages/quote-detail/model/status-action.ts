import { eventDateUnavailableCode } from '@legado/domain/quote/availability'
import { redirectDocument, type ActionFunctionArgs } from 'react-router'

export async function updateQuoteStatus({ params, request }: ActionFunctionArgs) {
  const fields = await request.formData()
  const number = encodeURIComponent(params.number ?? '')
  try {
    const response = await fetch('/admin/api/v1/quotes/' + number + '/status', {
      method: 'POST',
      credentials: 'same-origin',
      signal: request.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: fields.get('status'),
        expectedStatus: fields.get('expectedStatus'),
      }),
    })
    if (response.status === 401)
      return redirectDocument(
        new URL('/admin/login?next=' + encodeURIComponent('/admin/' + number), request.url).href,
      )
    if (response.status === 409) {
      const problem = await response.json().catch(() => null)
      return {
        result:
          problem?.code === eventDateUnavailableCode ? ('booked' as const) : ('conflict' as const),
      }
    }
    if (response.status === 204) return { result: 'saved' as const }
  } catch (error) {
    if (request.signal.aborted) throw error
  }
  return { result: 'failed' as const }
}
