import { Link, useLocation } from 'react-router'
import { useI18n } from '@legado/brand/i18n'
import { EventIcon } from '@legado/brand/controls'
import { fromApiQuote, type ApiSummary } from '@legado/domain/quote/wire'
import { eventLabels } from '@legado/domain/quote/request'
import { messages } from '../../../shared/config/messages'
import { EmptyNotice } from '../../../shared/ui/EmptyNotice'
import { QuoteStatusBadge } from './QuoteStatusBadge'
import './agenda.css'

export function Agenda({ rows }: { rows: ApiSummary[] }) {
  const { language, locale, t } = useI18n()
  const { pathname, search } = useLocation()
  if (!rows.length) return <EmptyNotice icon="date">{messages[language].noDates}</EmptyNotice>
  const dateLabel = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
  const groups = new Map<string, ApiSummary[]>()
  for (const row of rows) {
    const entries = groups.get(row.date)
    if (entries) entries.push(row)
    else groups.set(row.date, [row])
  }
  return (
    <div className="agenda-days">
      {Array.from(groups, ([date, entries]) => (
        <section key={date}>
          <h3>
            <time dateTime={date}>{dateLabel.format(new Date(date))}</time>
          </h3>
          <ul className="agenda-list">
            {entries.map((row) => {
              const event = fromApiQuote(row).event
              return (
                <li key={row.number} data-event={row.event}>
                  <Link to={'/' + row.number} state={{ pathname, search }}>
                    <EventIcon event={event} />
                    <span className="agenda-description">
                      <span className="agenda-event-heading">
                        <strong>{t(eventLabels[event])}</strong>
                        <QuoteStatusBadge status={row.status} />
                      </span>
                      <small>
                        {row.location} · {row.guests}{' '}
                        {t('quote.review.guests').toLocaleLowerCase(locale)}
                      </small>
                    </span>
                    <span className="agenda-serial">#{row.number}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
