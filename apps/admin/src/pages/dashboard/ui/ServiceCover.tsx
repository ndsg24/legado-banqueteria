import eventPhotoLarge from '../../../../../web/public/images/gallery/event-night-1600.webp?url'
import eventPhoto from '../../../../../web/public/images/gallery/event-night-800.webp?url'
import { Link } from 'react-router'
import { ActionLink, DetailIcon, EventIcon } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { eventLabels } from '@legado/domain/quote/request'
import { fromApiQuote, type ApiSummary } from '@legado/domain/quote/wire'
import { QuoteStatusBadge } from '../../../entities/quotes'
import { messages } from '../../../shared/config/messages'

function ServicePhoto() {
  return (
    <div className="service-cover__photo" aria-hidden="true">
      <img
        src={eventPhoto}
        srcSet={eventPhoto + ' 800w, ' + eventPhotoLarge + ' 1600w'}
        sizes="(max-width: 42rem) 100vw, (min-width: 100rem) 47rem, 47vw"
        alt=""
      />
    </div>
  )
}

export function ServiceCover({ next, today }: { next?: ApiSummary; today: string }) {
  const { language, locale, t } = useI18n()
  const copy = messages[language]

  if (!next) {
    return (
      <section className="service-cover" aria-labelledby="next-event-heading">
        <div className="service-cover__copy">
          <header className="next-event-header">
            <h2 id="next-event-heading">
              <DetailIcon kind="date" />
              {copy.nextRequest}
            </h2>
          </header>
          <div className="next-event-empty">
            <p>{copy.noUpcoming}</p>
            <Link to="/quotes">{copy.history}</Link>
          </div>
        </div>
        <ServicePhoto />
      </section>
    )
  }
  const event = fromApiQuote(next).event
  const date = new Date(next.date)
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(date)
  const daysAway = (date.getTime() - Date.parse(today)) / 86_400_000
  const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(daysAway, 'day')
  const confirmed = next.status === 'confirmed'
  const quotePath = '/' + next.number
  const preparationPath = '/preparation' + quotePath
  const dayLink =
    '/calendar?' + new URLSearchParams({ month: next.date.slice(0, 7), day: next.date })

  return (
    <section className="service-cover" aria-labelledby="next-event-heading">
      <div className="service-cover__copy">
        <header className="next-event-header">
          <h2 id="next-event-heading">
            <EventIcon event={event} />
            {copy.nextRequest}
          </h2>
          <QuoteStatusBadge status={next.status} />
        </header>
        <div className="next-event-content">
          <div className="next-event-body">
            <Link
              to={dayLink}
              className="next-event-date"
              aria-label={copy.openDay + ' · ' + format({ dateStyle: 'full' })}
            >
              <time dateTime={next.date}>
                <span>{format({ month: 'short' }).replace(/\.$/u, '')}</span>
                <strong className="dashboard-figure">{format({ day: 'numeric' })}</strong>
                <small>{format({ year: 'numeric' })}</small>
              </time>
            </Link>
            <div className="next-event-details">
              <p className="next-event-weekday">
                {format({ weekday: 'long' })} · {relative}
              </p>
              <div className="next-event-name">
                <h3>{t(eventLabels[event])}</h3>
                <span className="next-event-number" aria-label={copy.quote + ' #' + next.number}>
                  #{next.number}
                </span>
              </div>
              <div className="service-facts">
                <span>
                  <DetailIcon kind="location" />
                  {next.location}
                </span>
                <span>
                  <DetailIcon kind="guests" />
                  {Number(next.guests).toLocaleString(locale)}{' '}
                  {t('quote.review.guests').toLocaleLowerCase(locale)}
                </span>
              </div>
            </div>
          </div>
          <div className="service-cover-links">
            <ActionLink to={confirmed ? preparationPath : quotePath} state={{ pathname: '/' }}>
              {confirmed ? copy.prepare : copy.reviewQuote}
            </ActionLink>
            {confirmed && (
              <Link to={quotePath} state={{ pathname: '/' }}>
                {copy.quote}
              </Link>
            )}
          </div>
        </div>
      </div>
      <ServicePhoto />
    </section>
  )
}
