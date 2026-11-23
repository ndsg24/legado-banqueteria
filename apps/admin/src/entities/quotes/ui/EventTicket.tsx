import type { ReactNode } from 'react'
import { DetailIcon, EventIcon } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { eventCodes } from '@legado/domain/quote/wire'
import { eventLabels, type QuoteRequest } from '@legado/domain/quote/request'
import { displayDate } from '@legado/domain/quote/review'
import { messages } from '../../../shared/config/messages'
import './ticket.css'

export function EventTicket({
  quote,
  number,
  children,
}: {
  quote: QuoteRequest
  number: string
  children: ReactNode
}) {
  const { locale, t, language } = useI18n()
  const copy = messages[language]
  return (
    <header className="event-ticket admin-surface" data-event={eventCodes[quote.event]}>
      <div className="ticket-layout">
        <div className="ticket-identity">
          <span className="ticket-icon">
            <EventIcon event={quote.event} />
          </span>
          <div>
            <span className="ticket-reference">
              {copy.quote} #{number}
            </span>
            <h1>{t(eventLabels[quote.event])}</h1>
          </div>
        </div>
        <dl className="ticket-details">
          <div>
            <dt>
              <DetailIcon kind="date" />
              {t('quote.review.date')}
            </dt>
            <dd>
              <time dateTime={quote.date}>{displayDate(quote.date, locale, t)}</time>
            </dd>
          </div>
          <div className="ticket-location">
            <dt>
              <DetailIcon kind="location" />
              {t('quote.review.venue')}
            </dt>
            <dd>{quote.location}</dd>
          </div>
          <div>
            <dt>
              <DetailIcon kind="guests" />
              {t('quote.review.guests')}
            </dt>
            <dd>{new Intl.NumberFormat(locale).format(Number(quote.guests))}</dd>
          </div>
        </dl>
        <div className="ticket-actions">{children}</div>
      </div>
    </header>
  )
}
