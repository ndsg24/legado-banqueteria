import { localToday } from '../../../entities/quotes'
import { readAdminApi } from '../../../shared/api'
import type { PurchaseReport } from '@legado/domain/operations/purchasing'

export async function loader({ request }: { request: Request }) {
  const params = new URL(request.url).searchParams
  const start = localToday()
  const from = params.get('from') ?? start.toString()
  const to = params.get('to') ?? start.add({ days: 6 }).toString()
  const dates = [from, to].every(
    (s) =>
      /^\d{4}-\d{2}-\d{2}$/.test(s) &&
      Number.isFinite(Date.parse(s)) &&
      new Date(s).toISOString().slice(0, 10) === s,
  )
  const valid = dates && from <= to && Date.parse(to) - Date.parse(from) <= 30 * 86400000
  const report = valid
    ? ((await readAdminApi(
        'purchasing?' + new URLSearchParams({ from, to }),
        request.signal,
      )) as PurchaseReport)
    : null
  return { from, to, report }
}
