import { parseDate, today } from '@internationalized/date'
import type { ApiCalendarDay, ApiQuotePage } from '@legado/domain/quote/wire'
import { eventTimeZone } from '@legado/domain/quote/dates'
import { readAdminApi } from '../../../shared/api'

export const localToday = () => today(eventTimeZone)

export function monthStart(month: string | null) {
  if (month && /^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return parseDate(month + '-01')
  return localToday().set({ day: 1 })
}

export function quotePage(params: URLSearchParams, signal: AbortSignal): Promise<ApiQuotePage> {
  return readAdminApi('quotes?' + params, signal)
}

export function monthActivity(
  month: string,
  signal: AbortSignal,
  status = 'active',
): Promise<ApiCalendarDay[]> {
  return readAdminApi(
    'quotes/calendar?' + new URLSearchParams(status === 'active' ? { month } : { month, status }),
    signal,
  )
}
