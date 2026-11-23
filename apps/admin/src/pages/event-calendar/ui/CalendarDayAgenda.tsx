import { useEffect, useRef } from 'react'
import { ActionLink, EventIcon } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { eventLabels } from '@legado/domain/quote/request'
import { fromApiQuote, type ApiQuotePage } from '@legado/domain/quote/wire'
import { Link, useLocation } from 'react-router'
import { QuoteStatusBadge } from '../../../entities/quotes'
import { messages } from '../../../shared/config/messages'
import { EmptyNotice } from '../../../shared/ui/EmptyNotice'
import { Pagination } from '../../../shared/ui/Pagination'

export function CalendarDayAgenda({
  day,
  selected,
  agenda,
  monthLink,
}: {
  day?: string
  selected: boolean
  agenda: ApiQuotePage | null
  monthLink: string
}) {
  const { language, locale, t } = useI18n()
  const copy = messages[language]
  const { pathname, search } = useLocation()
  const heading = useRef<HTMLHeadingElement>(null)
  const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' })
  const numbers = new Intl.NumberFormat(locale)

  useEffect(() => {
    const target = heading.current
    if (selected && target && target.getBoundingClientRect().bottom > window.innerHeight) {
      target.focus({ preventScroll: true })
      target.scrollIntoView({ block: 'start' })
    }
  }, [day, selected])

  return (
    <section
      className="admin-surface month-agenda"
      data-day-selected={selected}
      aria-labelledby="calendar-day-heading"
    >
      <header>
        <div>
          <h2 id="calendar-day-heading" ref={heading} tabIndex={-1}>
            {copy.calendarDay}
          </h2>
          {day && <time dateTime={day}>{fullDate.format(new Date(day))}</time>}
        </div>
        {selected && <Link to={monthLink}>{copy.wholeMonth}</Link>}
      </header>
      {agenda?.items.length ? (
        <ul className="calendar-day-events">
          {agenda.items.map((row) => {
            const event = fromApiQuote(row).event
            const confirmed = row.status === 'confirmed'
            const quotePath = '/' + row.number
            return (
              <li key={row.number} data-event={row.event}>
                <div className="calendar-event-summary">
                  <EventIcon event={event} />
                  <div>
                    <h3>{t(eventLabels[event])}</h3>
                    <p>
                      {row.location} · {numbers.format(Number(row.guests))}{' '}
                      {t('quote.review.guests').toLocaleLowerCase(locale)}
                    </p>
                    <QuoteStatusBadge status={row.status} />
                  </div>
                </div>
                <div className="calendar-event-actions">
                  <ActionLink
                    to={confirmed ? '/preparation' + quotePath : quotePath}
                    variant={row.status === 'cancelled' ? 'secondary' : 'primary'}
                    state={{ pathname, search }}
                  >
                    {confirmed ? copy.prepare : copy.reviewQuote}
                  </ActionLink>
                  {confirmed && (
                    <Link to={quotePath} state={{ pathname, search }}>
                      {copy.quote} #{row.number}
                    </Link>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <EmptyNotice icon="date">{copy.noDates}</EmptyNotice>
      )}
      {agenda && agenda.total > agenda.pageSize && <Pagination {...agenda} />}
    </section>
  )
}
