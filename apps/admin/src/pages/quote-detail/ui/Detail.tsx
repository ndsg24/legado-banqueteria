import { Link, useLoaderData, useLocation } from 'react-router'
import { ActionLink, DetailIcon } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { fromApiQuote } from '@legado/domain/quote/wire'
import { displayDate } from '@legado/domain/quote/review'
import { EventTicket, QuoteTableDetail, quoteStatusCopy } from '../../../entities/quotes'
import { operations } from '../../../shared/config/operations'
import { messages } from '../../../shared/config/messages'
import type { loadQuoteDossier } from '../model/loader'
import { dossierCopy } from '../model/copy'
import { purchaseCopy } from '../model/purchase-copy'
import { RequestedMenu } from './RequestedMenu'
import { GuestRequirements } from './GuestRequirements'
import { EventPurchases } from './EventPurchases'
import { CommercialStatus } from './CommercialStatus'
import './detail.css'

export function Detail() {
  const { quote: detail, book } = useLoaderData<typeof loadQuoteDossier>()
  const { number, payload: wire, status } = detail
  const quote = fromApiQuote(wire)
  const { t, locale, language } = useI18n()
  const copy = messages[language]
  const sales = quoteStatusCopy[language]
  const state = useLocation().state as { search?: string; pathname?: string } | null
  const origin =
    state?.pathname === '/calendar' || state?.pathname === '/' ? state.pathname : '/quotes'
  const template = {
    name: quote.name,
    number,
    date: displayDate(quote.date, locale, t),
    location: quote.location,
  }
  const body = sales.draft.replace(
    /\{(name|number|date|location)\}/g,
    (_, key: keyof typeof template) => template[key],
  )
  const subject = copy.quote + ' #' + number + ' · Legado'
  const recipient = encodeURIComponent(quote.email).replace('%40', '@')
  const mailto =
    'mailto:' +
    recipient +
    '?subject=' +
    encodeURIComponent(subject) +
    '&body=' +
    encodeURIComponent(body)
  return (
    <article className="quote-dossier">
      <Link className="back" to={{ pathname: origin, search: state?.search }}>
        {origin === '/calendar' ? copy.calendar : origin === '/' ? copy.dashboard : copy.back}
      </Link>
      <EventTicket number={number} quote={quote}>
        {status === 'confirmed' && (
          <ActionLink to={'/preparation/' + number}>{operations[language].prep}</ActionLink>
        )}
        <ActionLink variant="secondary" to={'/finance?quoteNumber=' + number}>
          {operations[language].finance}
        </ActionLink>
      </EventTicket>
      <nav className="dossier-index" aria-label={dossierCopy[language].sections}>
        <a href="#event-menu">{sales.menu}</a>
        <a href="#event-purchases">{purchaseCopy[language].title}</a>
        <a href="#event-setting">{t('quote.review.setting')}</a>
        <a href="#event-requirements">{t('quote.review.dietaryNeeds')}</a>
        <a href="#event-contact">{t('quote.review.contact')}</a>
      </nav>
      <div className="dossier-body">
        <div className="dossier-column">
          <RequestedMenu quote={quote} />
          <QuoteTableDetail design={quote.table} guests={quote.guests} />
          <GuestRequirements quote={quote} />
        </div>
        <div className="dossier-column">
          <EventPurchases
            number={number}
            quote={quote}
            book={book}
            confirmed={status === 'confirmed'}
          />
          <section id="event-contact" className="admin-surface dossier-contact">
            <div>
              <h2>{t('quote.review.contact')}</h2>
              <strong>{quote.name}</strong>
            </div>
            <address>
              <a href={'mailto:' + recipient}>
                <DetailIcon kind="email" />
                {quote.email}
              </a>
              {quote.phone && (
                <a href={'tel:' + quote.phone}>
                  <DetailIcon kind="phone" />
                  {quote.phone}
                </a>
              )}
            </address>
            <a className="button--secondary" href={mailto}>
              {sales.reply}
            </a>
          </section>
          <CommercialStatus
            key={number}
            status={status}
            dateBooked={detail.dateBookedByAnotherEvent === true}
          />
        </div>
      </div>
    </article>
  )
}
