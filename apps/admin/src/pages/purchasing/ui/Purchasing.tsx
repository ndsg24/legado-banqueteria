import { Form, Link, useLoaderData } from 'react-router'
import { ActionButton, TextField, DetailIcon } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { displayDate } from '@legado/domain/quote/review'
import { workbench } from '../../../shared/config/workbench'
import { operations } from '../../../shared/config/operations'
import { messages } from '../../../shared/config/messages'
import { downloadCsv, supplyQuantityFormatter } from '../../../shared/lib'
import { EmptyNotice } from '../../../shared/ui/EmptyNotice'
import type { loader } from '../model/loader'
import './purchasing.css'

export function Purchasing() {
  const { from, to, report } = useLoaderData<typeof loader>()
  const { language, locale, t } = useI18n()
  const c = workbench[language],
    op = operations[language],
    copy = messages[language]
  const formatQuantity = supplyQuantityFormatter(locale, op.unit)
  const rows = [...(report?.lines ?? [])].sort((a, b) => t(a.name).localeCompare(t(b.name), locale))
  const guests = t('quote.review.guests')
  function exportOrder() {
    if (!report) return
    downloadCsv('legado-' + from + '_' + to + '.csv', [
      [
        op.supplies,
        op.quantity,
        op.measure,
        ...report.events.map((e) => copy.quote + ' #' + e.number),
      ],
      ...rows.map((row) => {
        const allocations = new Map(row.orders.map((order) => [order.number, order.amount]))
        return [
          t(row.name),
          row.unit === 'unit' ? Math.ceil(row.amount) : row.amount,
          row.unit,
          ...report.events.map((e) => allocations.get(e.number) ?? 0),
        ]
      }),
    ])
  }
  return (
    <section className="purchasing-desk">
      <header className="market-cover">
        <div>
          <p>{c.periodHint}</p>
          <h1 className="admin-visually-hidden">{c.purchasing}</h1>
        </div>
        {report && (
          <dl>
            {[
              [c.confirmed, report.events.length],
              [guests, report.guests],
              [c.products, rows.length],
            ].map(([label, n]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{n.toLocaleString(locale)}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>
      <Form className="market-range" key={from + to}>
        <TextField type="date" label={c.start} name="from" defaultValue={from} required />
        <TextField type="date" label={c.end} name="to" defaultValue={to} required />
        <ActionButton type="submit" variant="secondary">
          {c.period}
        </ActionButton>
      </Form>
      {!report ? (
        <p role="alert">{c.validRange}</p>
      ) : !report.events.length ? (
        <div className="admin-surface market-empty">
          <EmptyNotice icon="date">{c.noOrders}</EmptyNotice>
          <Link to="/quotes?status=requested">{copy.history}</Link>
        </div>
      ) : (
        <div className="market-columns">
          <section className="admin-surface market-sheet">
            <header>
              <h2>{c.products}</h2>
              {rows.length > 0 && (
                <ActionButton variant="secondary" onPress={exportOrder}>
                  {c.download}
                </ActionButton>
              )}
            </header>
            <p>{c.estimate}</p>
            {rows.length ? (
              <ul>
                {rows.map((row) => (
                  <li key={row.name + row.unit}>
                    <details>
                      <summary>
                        <span>{t(row.name)}</span>
                        <b>
                          {formatQuantity(
                            row.unit === 'unit' ? Math.ceil(row.amount) : row.amount,
                            row.unit,
                          )}
                        </b>
                      </summary>
                      <ul aria-label={c.included}>
                        {row.orders.map((o) => (
                          <li key={o.number}>
                            <Link to={'/preparation/' + o.number}>
                              {copy.quote} #{o.number}
                            </Link>
                            <span>{formatQuantity(o.amount, row.unit)}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{op.noYields}</p>
            )}
          </section>
          <aside className="admin-surface market-events">
            <h2>{c.source}</h2>
            {report.events.map((e) => (
              <article key={e.number}>
                <Link to={'/preparation/' + e.number}>
                  <DetailIcon kind="date" />
                  <strong>#{e.number}</strong> {displayDate(e.date, locale, t)}
                </Link>
                <p>
                  {e.guests.toLocaleString(locale)} {guests.toLocaleLowerCase(locale)}
                </p>
                {e.missingRecipes.length > 0 && (
                  <p className="market-missing">
                    {c.pending} · {e.missingRecipes.map((k) => t(k)).join(', ')}
                  </p>
                )}
              </article>
            ))}
            <Link to="/recipes">{c.recipes}</Link>
          </aside>
        </div>
      )}
    </section>
  )
}
