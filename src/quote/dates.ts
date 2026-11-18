import { today } from '@internationalized/date'

export const eventTimeZone = 'America/Santiago'

export function eventDateRange(first = today(eventTimeZone)) {
  return { first, last: first.add({ years: 1 }) }
}

export function isEventDateInRange(value: string) {
  const { first, last } = eventDateRange()
  return value >= first.toString() && value <= last.toString()
}
