import { ActionLink, DetailIcon, EventIcon, SearchableSelect } from '@legado/brand/controls'
import { Link, useLoaderData, useSearchParams } from 'react-router'
import { fromApiQuote } from '@legado/domain/quote/wire'
import { eventLabels } from '@legado/domain/quote/request'
import { useI18n } from '@legado/brand/i18n'
import { localToday, monthStart, quoteStatusCopy } from '../../../entities/quotes'
import { workbench } from '../../../shared/config/workbench'
import { messages } from '../../../shared/config/messages'
import { CalendarDayAgenda } from './CalendarDayAgenda'
import type { loadCalendar } from '../model/loader'
import './calendar.css'

export function EventCalendar() {
  const { month, day, focusDay, days, agenda, status } = useLoaderData<typeof loadCalendar>()
  const { locale, language, t } = useI18n()
  const copy = messages[language]
  const bench = workbench[language],
    states = quoteStatusCopy[language]
  const [params, setParams] = useSearchParams()
  const listView = params.get('view') === 'list'
  function monthLink(month: string, day?: string) {
    const q = new URLSearchParams({ month })
    if (day) q.set('day', day)
    if (status !== (day ? 'active' : 'confirmed')) q.set('status', status)
    if (listView) q.set('view', 'list')
    return '?' + q
  }
  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    next.set(key, value)
    next.delete('page')
    setParams(next)
  }
  const start = monthStart(month)
  const today = localToday().toString()
  const monday = start.subtract({ days: (start.toDate('UTC').getUTCDay() + 6) % 7 })
  const occupied = new Map(days.map((d) => [d.date, d]))
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' })
  const monthLabel = format({ month: 'long', year: 'numeric' }).format(start.toDate('UTC'))
  const requests = days.reduce((sum, date) => sum + date.count, 0)
  const guests = days.reduce((sum, date) => sum + date.guests, 0)
  const weekday = format({ weekday: 'short' })
  const fullDate = format({ dateStyle: 'full' })
  return (
    <section className="events-view">
      <div className="calendar-spread">
        <section className="admin-surface month-sheet" aria-labelledby="month-heading">
          <header className="month-toolbar">
            <div className="month-overview">
              <h1 id="month-heading" aria-label={copy.calendar + ' · ' + monthLabel}>
                {monthLabel}
              </h1>
              <dl className="month-totals">
                <div>
                  <dt>{status === 'confirmed' ? states.confirmedPlural : copy.requests}</dt>
                  <dd>{requests.toLocaleString(locale)}</dd>
                </div>
                <div>
                  <dt>{t('quote.review.guests')}</dt>
                  <dd>{guests.toLocaleString(locale)}</dd>
                </div>
              </dl>
            </div>
            <div className="month-controls">
              <Link
                aria-label={copy.previous}
                to={monthLink(start.subtract({ months: 1 }).toString().slice(0, 7))}
              >
                ‹
              </Link>
              <Link to={monthLink(today.slice(0, 7), today)}>{copy.today}</Link>
              <Link
                aria-label={copy.next}
                to={monthLink(start.add({ months: 1 }).toString().slice(0, 7))}
              >
                ›
              </Link>
            </div>
          </header>
          <div className="calendar-tools">
            <div className="measure-switch" role="group" aria-label={copy.calendar}>
              <button
                type="button"
                aria-pressed={!listView}
                onClick={() => update('view', 'month')}
              >
                {copy.calendarMonthView}
              </button>
              <button type="button" aria-pressed={listView} onClick={() => update('view', 'list')}>
                {copy.calendarListView}
              </button>
            </div>
            <SearchableSelect
              className="work-filter"
              label={bench.status}
              listLabel={bench.status}
              value={status}
              onChange={(value) => update('status', value)}
              options={(['active', 'requested', 'confirmed', 'cancelled'] as const).map((id) => ({
                id,
                label: states[id],
              }))}
              search={{ label: copy.search, placeholder: copy.search, isDisabled: true }}
            />
            <ActionLink
              variant="secondary"
              to={
                '/purchasing?' +
                new URLSearchParams({
                  from: day || start.toString(),
                  to: day || start.add({ months: 1 }).subtract({ days: 1 }).toString(),
                })
              }
            >
              {day ? bench.dayOrder : bench.monthOrder}
            </ActionLink>
          </div>
          {listView ? (
            <div className="run-sheet">
              {days.length ? (
                days.map((d) => (
                  <Link
                    key={d.date}
                    to={monthLink(month, d.date)}
                    aria-current={d.date === focusDay ? 'date' : undefined}
                  >
                    <time dateTime={d.date}>
                      <b>{Number(d.date.slice(-2))}</b>
                      {weekday.format(new Date(d.date))}
                    </time>
                    <span>
                      {d.count.toLocaleString(locale)} {copy.requests.toLocaleLowerCase(locale)}
                    </span>
                    <strong>
                      {d.guests.toLocaleString(locale)}{' '}
                      {t('quote.review.guests').toLocaleLowerCase(locale)}
                    </strong>
                  </Link>
                ))
              ) : (
                <p>{copy.noDates}</p>
              )}
            </div>
          ) : (
            <table className="month-grid" aria-label={monthLabel}>
              <thead>
                <tr>
                  {Array.from({ length: 7 }, (_, i) => (
                    <th key={i} scope="col">
                      {weekday.format(monday.add({ days: i }).toDate('UTC'))}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }, (_, w) => (
                  <tr key={w}>
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = monday.add({ days: 7 * w + i })
                      const iso = date.toString()
                      const activity = occupied.get(iso)
                      const count = activity?.count ?? 0
                      const event =
                        activity && count === 1 ? fromApiQuote(activity).event : undefined
                      const label = event ? t(eventLabels[event]) : copy.requests
                      return (
                        <td key={iso} data-outside={date.month !== start.month}>
                          <Link
                            to={monthLink(iso.slice(0, 7), iso)}
                            data-selected={iso === focusDay}
                            aria-current={iso === today ? 'date' : undefined}
                            aria-label={
                              fullDate.format(date.toDate('UTC')) +
                              (count ? ' · ' + label + ' (' + count + ')' : '')
                            }
                          >
                            <span>{date.day}</span>
                            {activity && (
                              <small
                                className="day-event"
                                data-event={event ? activity.event : undefined}
                                data-load={event ? 'booked' : 'shared'}
                              >
                                {event ? <EventIcon event={event} /> : <DetailIcon kind="date" />}
                                <span>{label}</span>
                                <b>{count}</b>
                              </small>
                            )}
                          </Link>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <CalendarDayAgenda
          day={focusDay}
          selected={Boolean(day)}
          agenda={agenda}
          monthLink={monthLink(month)}
        />
      </div>
    </section>
  )
}
