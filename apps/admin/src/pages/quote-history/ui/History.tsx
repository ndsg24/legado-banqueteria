import { QuoteStatusBadge, quoteStatusCopy } from '../../../entities/quotes'
import { StatusNavigation } from './StatusNavigation'
import { operations } from '../../../shared/config/operations'
import { EmptyNotice } from '../../../shared/ui/EmptyNotice'
import { PageHeading } from '../../../shared/ui/PageHeading'
import { Form, Link, useLoaderData, useSearchParams } from 'react-router'
import { ActionButton, EventIcon, TextField, NativeSelect } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { eventCodes, fromApiQuote, type ApiQuotePage } from '@legado/domain/quote/wire'
import { eventLabels, eventTypes } from '@legado/domain/quote/request'
import { displayDate } from '@legado/domain/quote/review'
import { messages } from '../../../shared/config/messages'
import { Pagination } from '../../../shared/ui/Pagination'
import { quoteSortFields, type QuoteSort } from '@legado/domain/quote/history'
import './history.css'

const strokes = {
  search: 'M20 20l-5-5 M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0',
  next: 'm10 6 6 6-6 6',
}
function Icon({ name }: { name: keyof typeof strokes }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={strokes[name]} />
    </svg>
  )
}

export function History({ preparation = false }: { preparation?: boolean }) {
  const { items, total, page, pageSize } = useLoaderData<ApiQuotePage>()
  const { language, t, locale } = useI18n()
  const copy = messages[language]
  const [params, setParams] = useSearchParams()
  const statusFilter = preparation ? null : params.get('status')
  const filtered = !!(params.get('search') || params.get('event') || statusFilter)
  const sort = params.get('sort') || 'number'
  const direction = params.get('direction') || 'desc'
  function sorted(key: QuoteSort, dir: string) {
    const next = new URLSearchParams(params)
    next.delete('before')
    next.delete('page')
    next.set('sort', key)
    next.set('direction', dir)
    return next
  }
  const date = t('quote.review.date')
  const guests = t('quote.review.guests')
  const typeLabel = t('quote.review.eventType')
  const labels = {
    number: copy.number,
    location: t('quote.review.venue'),
    event: typeLabel,
    date,
    guests,
  }
  return (
    <section className="history" aria-labelledby="history-title">
      <PageHeading
        id="history-title"
        title={preparation ? operations[language].prep : copy.history}
        titleInNavigation
      >
        <span className="history-count">
          {total.toLocaleString(locale)} {copy.requests.toLocaleLowerCase(locale)}
        </span>
      </PageHeading>
      {!preparation && <StatusNavigation />}
      <div className="admin-surface history-sheet">
        {preparation && (
          <p className="preparation-intro">
            <EventIcon event="Encuentro familiar" />
            {operations[language].pick}
          </p>
        )}
        <nav className="event-filters" aria-label={typeLabel}>
          {[null, ...eventTypes].map((event) => {
            const code = event ? eventCodes[event] : ''
            const query = new URLSearchParams(params)
            query.delete('page')
            query.delete('before')
            if (code) query.set('event', code)
            else query.delete('event')
            return (
              <Link
                key={code}
                data-event={code}
                to={{ search: query.toString() }}
                aria-current={(params.get('event') || '') === code ? 'true' : undefined}
              >
                {event && <EventIcon event={event} />}
                {event ? t(eventLabels[event]) : copy.allEvents}
              </Link>
            )
          })}
        </nav>
        <Form className="history-search" role="search" key={params.get('search') || ''}>
          {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
          <input type="hidden" name="sort" value={sort} />
          <input type="hidden" name="direction" value={direction} />
          <input type="hidden" name="pageSize" value={pageSize} />
          <div className="history-query">
            <TextField
              name="search"
              type="search"
              label={copy.search}
              placeholder={copy.searchHint}
              maxLength={80}
              defaultValue={params.get('search') || ''}
            />
            <Icon name="search" />
          </div>
          {params.get('event') && <input type="hidden" name="event" value={params.get('event')!} />}
          <ActionButton type="submit" variant="secondary">
            {copy.apply}
          </ActionButton>
          {filtered && (
            <Link className="history-clear" to={preparation ? '/preparation' : '/quotes'}>
              {copy.clear}
            </Link>
          )}
        </Form>
        <label className="mobile-sort">
          {copy.sortBy}
          <NativeSelect
            value={sort + ':' + direction}
            onChange={(e) => {
              const [field, dir] = e.target.value.split(':')
              setParams(sorted(field as QuoteSort, dir))
            }}
          >
            {quoteSortFields.flatMap((key) =>
              ['asc', 'desc'].map((dir) => (
                <option key={key + dir} value={key + ':' + dir}>
                  {labels[key]} · {dir === 'asc' ? copy.ascending : copy.descending}
                </option>
              )),
            )}
          </NativeSelect>
        </label>
        {items.length ? (
          <table className="history-table" role="table" aria-labelledby="history-title">
            <thead>
              <tr>
                {quoteSortFields.map((key) => (
                  <th
                    key={key}
                    scope="col"
                    aria-sort={
                      key !== sort ? undefined : direction === 'asc' ? 'ascending' : 'descending'
                    }
                  >
                    <Link
                      to={'?' + sorted(key, key === sort && direction === 'asc' ? 'desc' : 'asc')}
                    >
                      {labels[key]}{' '}
                      <span
                        aria-hidden="true"
                        className="sort-indicator"
                        data-direction={key === sort ? direction : 'both'}
                      />
                    </Link>
                  </th>
                ))}
                <th scope="col">{quoteStatusCopy[language].status}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const event = fromApiQuote(row).event
                return (
                  <tr key={row.number}>
                    <th scope="row">
                      <Link
                        className="quote-entry"
                        to={(preparation ? '/preparation/' : '/') + row.number}
                        state={{ search: params.toString() }}
                      >
                        <span className="quote-entry-icon" data-event={row.event}>
                          <EventIcon event={event} />
                        </span>
                        <span>
                          <strong>{t(eventLabels[event])}</strong>
                          <small className="mobile-key">#{row.number}</small>
                        </span>
                        <Icon name="next" />
                      </Link>
                    </th>
                    <td className="history-id">
                      <Link
                        to={(preparation ? '/preparation/' : '/') + row.number}
                        state={{ search: params.toString() }}
                        aria-label={copy.quote + ' #' + row.number}
                      >
                        #{row.number}
                      </Link>
                    </td>
                    <td className="history-place">
                      <span className="mobile-key">{labels.location}</span>
                      {row.location}
                    </td>
                    <td>
                      <span className="mobile-key" aria-hidden="true">
                        {date}
                      </span>
                      <time dateTime={row.date}>{displayDate(row.date, locale, t)}</time>
                    </td>
                    <td className="history-guests">
                      <span className="mobile-key" aria-hidden="true">
                        {guests}
                      </span>
                      {Number(row.guests).toLocaleString(locale)}
                    </td>
                    <td className="history-status">
                      <QuoteStatusBadge status={row.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <EmptyNotice icon={preparation ? 'guests' : 'email'}>
            {filtered ? copy.noMatches : copy.empty}
          </EmptyNotice>
        )}
        <Pagination page={page} pageSize={pageSize} total={total} allowResize />
      </div>
    </section>
  )
}
