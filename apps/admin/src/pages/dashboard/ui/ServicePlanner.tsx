import { useState } from 'react'
import { parseDate } from '@internationalized/date'
import { Link } from 'react-router'
import { useI18n } from '@legado/brand/i18n'
import { DetailIcon } from '@legado/brand/controls'
import type { ApiCalendarDay } from '@legado/domain/quote/wire'
import { messages } from '../../../shared/config/messages'
import './service-planner.css'

export function ServicePlanner({ today, activity }: { today: string; activity: ApiCalendarDay[] }) {
  const { language, locale, t } = useI18n()
  const c = messages[language]
  const [offset, setOffset] = useState(0)
  const start = parseDate(today).add({ days: offset })
  const byDate = new Map(activity.map((day) => [day.date, day]))
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = start.add({ days: i })
    const record = byDate.get(date.toString())
    return { date, count: record?.count ?? 0, guests: record?.guests ?? 0 }
  })
  const period = new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })
  const numbers = new Intl.NumberFormat(locale)
  const requestUnit = (n: number) => (n === 1 ? c.oneRequest : c.requests.toLocaleLowerCase(locale))
  const guestUnit = (n: number) =>
    n === 1 ? c.oneGuest : t('quote.review.guests').toLocaleLowerCase(locale)
  const overlaps = dates.filter((day) => day.count > 1)
  const total = dates.reduce((n, day) => n + day.guests, 0)
  const requests = dates.reduce((n, day) => n + day.count, 0)
  return (
    <section className="service-planner admin-surface" aria-labelledby="planner-heading">
      <header>
        <div>
          <h2 id="planner-heading">{c.servicePlan}</h2>
          <span>{period.formatRange(start.toDate('UTC'), dates[6].date.toDate('UTC'))}</span>
        </div>
        <div className="measure-switch" role="group" aria-label={c.servicePlan}>
          {[c.nextWeek, c.followingWeek].map((label, index) => (
            <button
              type="button"
              key={label}
              aria-pressed={offset === index * 7}
              onClick={() => setOffset(index * 7)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      <ol className="service-days">
        {dates.map(({ date, count, guests: covers }) => {
          const iso = date.toString()
          return (
            <li key={iso}>
              <Link
                to={'/calendar?month=' + iso.slice(0, 7) + '&day=' + iso}
                data-load={count > 1 ? 'shared' : count ? 'booked' : 'empty'}
                aria-label={[
                  period.format(date.toDate('UTC')),
                  numbers.format(count) + ' ' + requestUnit(count),
                  numbers.format(covers) + ' ' + guestUnit(covers),
                ].join(', ')}
              >
                <span className="day-weekday">{weekday.format(date.toDate('UTC'))}</span>
                <time dateTime={iso}>{numbers.format(date.day)}</time>
                {count > 0 ? (
                  <small className="day-load">
                    <span>
                      <DetailIcon kind="email" />
                      {numbers.format(count)}
                      <span className="day-unit">{requestUnit(count)}</span>
                    </span>
                    <span>
                      <DetailIcon kind="guests" />
                      {numbers.format(covers)}
                      <span className="day-unit">{guestUnit(covers)}</span>
                    </span>
                  </small>
                ) : (
                  <small className="day-idle" aria-hidden="true">
                    —
                  </small>
                )}
              </Link>
            </li>
          )
        })}
      </ol>
      <p className="planner-summary" aria-live="polite">
        {requests > 0 ? (
          <>
            <strong>
              {numbers.format(requests)} {requestUnit(requests)} · {numbers.format(total)}{' '}
              {guestUnit(total)}
            </strong>
            {overlaps.length > 0 && (
              <span>
                {c.sharedDates} ·{' '}
                {overlaps.map(({ date }) => period.format(date.toDate('UTC'))).join(', ')}
              </span>
            )}
          </>
        ) : (
          c.quietWeek
        )}
      </p>
    </section>
  )
}
