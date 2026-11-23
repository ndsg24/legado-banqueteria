import { readAdminApi } from '../../../shared/api'
import type { LedgerPage } from '@legado/domain/operations/finance'
import { redirect } from 'react-router'
import { localToday, monthActivity, quotePage } from '../../../entities/quotes'

export async function loadDashboard({ request }: { request: Request }) {
  const url = new URL(request.url)
  if (
    ['page', 'before', 'search', 'event', 'sort', 'pageSize', 'direction'].some((key) =>
      url.searchParams.has(key),
    )
  )
    throw redirect('/quotes' + url.search)
  const start = localToday()
  const today = start.toString()
  const currentMonth = today.slice(0, 7)
  const endMonth = start.add({ days: 13 }).toString().slice(0, 7)
  const [history, upcoming, month, ledger, nextMonth, pending, confirmed] = await Promise.all([
    quotePage(new URLSearchParams({ pageSize: '1' }), request.signal),
    quotePage(
      new URLSearchParams({
        from: today,
        status: 'active',
        sort: 'date',
        direction: 'asc',
        pageSize: '5',
      }),
      request.signal,
    ),
    monthActivity(currentMonth, request.signal),
    readAdminApi('ledger?month=' + today.slice(0, 7), request.signal) as Promise<LedgerPage>,
    endMonth === currentMonth ? [] : monthActivity(endMonth, request.signal),
    quotePage(new URLSearchParams({ status: 'requested', pageSize: '1' }), request.signal),
    quotePage(new URLSearchParams({ status: 'confirmed', pageSize: '1' }), request.signal),
  ])
  return {
    today,
    ledger,
    total: history.total,
    days: month,
    pending: pending.total,
    confirmed: confirmed.total,
    planningDays: [...month, ...nextMonth],
    upcoming: upcoming.items,
    events: month.reduce((sum, day) => sum + day.count, 0),
    guests: month.reduce((sum, day) => sum + day.guests, 0),
  }
}
