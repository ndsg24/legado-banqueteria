import { localToday, monthActivity, monthStart, quotePage } from '../../../entities/quotes'

export async function loadCalendar({ request }: { request: Request }) {
  const params = new URL(request.url).searchParams
  const start = monthStart(params.get('month'))
  const first = start.toString()
  const last = start.add({ months: 1 }).subtract({ days: 1 }).toString()
  const month = first.slice(0, 7)
  const input = params.get('day') || ''
  const day = /^\d{4}-\d{2}-\d{2}$/.test(input) && input >= first && input <= last ? input : ''
  const defaultStatus = day ? 'active' : 'confirmed'
  const filter = params.get('status') ?? defaultStatus
  const status = ['active', 'confirmed', 'requested', 'cancelled'].includes(filter)
    ? filter
    : defaultStatus
  function readDay(date: string) {
    return quotePage(
      new URLSearchParams({
        status,
        from: date,
        to: date,
        sort: 'date',
        direction: 'asc',
        pageSize: '5',
        page: params.get('page') || '1',
      }),
      request.signal,
    )
  }
  const [days, selectedAgenda] = await Promise.all([
    monthActivity(month, request.signal, status),
    day ? readDay(day) : null,
  ])
  const today = localToday().toString()
  const suggestedDay =
    month === today.slice(0, 7)
      ? (days.find(({ date }) => date >= today)?.date ?? days.at(-1)?.date)
      : days[0]?.date
  const focusDay = day || suggestedDay
  const agenda = selectedAgenda ?? (focusDay ? await readDay(focusDay) : null)
  return { month, day, focusDay, days, agenda, status }
}
