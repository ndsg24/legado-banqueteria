import { useState } from 'react'
import { Link, useRevalidator } from 'react-router'
import { ActionButton } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { preparationPlan } from '@legado/domain/operations/preparation'
import type { RecipeBook } from '@legado/domain/operations/recipes'
import type { QuoteRequest } from '@legado/domain/quote/request'
import { purchaseLines, readPreparationSheet } from '../../../entities/preparation'
import { operations } from '../../../shared/config/operations'
import { messages } from '../../../shared/config/messages'
import { downloadCsv, supplyQuantityFormatter } from '../../../shared/lib'
import { purchaseCopy } from '../model/purchase-copy'
import './event-purchases.css'

type PurchaseProps = { number: string; quote: QuoteRequest; book: RecipeBook; confirmed: boolean }
type Props = Omit<PurchaseProps, 'book'> & { book: RecipeBook | null }

export function EventPurchases({ number, quote, book, confirmed }: Props) {
  const { language } = useI18n()
  const labels = purchaseCopy[language]
  const { revalidate, state } = useRevalidator()
  return (
    <section
      className="admin-surface event-purchases"
      id="event-purchases"
      aria-labelledby="purchases-title"
      tabIndex={-1}
    >
      <h2 id="purchases-title">{labels.title}</h2>
      {book === null ? (
        <div className="purchase-unavailable" role="status">
          <p>{labels.unavailable}</p>
          <ActionButton
            variant="secondary"
            isDisabled={state !== 'idle'}
            onPress={() => void revalidate()}
          >
            {messages[language].retry}
          </ActionButton>
        </div>
      ) : (
        <PurchaseList
          key={number}
          number={number}
          quote={quote}
          book={book}
          confirmed={confirmed}
        />
      )}
    </section>
  )
}

function PurchaseList({ number, quote, book, confirmed }: PurchaseProps) {
  const { language, locale, t } = useI18n()
  const op = operations[language]
  const labels = purchaseCopy[language]
  const [sheet] = useState(() => readPreparationSheet(number))
  const plan = preparationPlan(quote, book)
  const format = supplyQuantityFormatter(locale, op.unit)
  const rows = purchaseLines(plan.resources, sheet.packs)
    .map((row) => {
      const contributors = [...(plan.sources.get(row.id) ?? [])]
        .filter((key) => key !== row.name)
        .map((key) => t(key))
        .join(', ')
      const finishedProduct = row.name.startsWith('menu.dishes.') ? labels.finishedProduct : ''
      return {
        ...row,
        label: t(row.name),
        usedIn: [finishedProduct, contributors].filter(Boolean).join(' · '),
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label, locale))
  const hasPacks = rows.some((row) => row.packCount !== null)
  const unfinished = plan.dishes.filter((d) => d.servings > 0 && d.pending)
  const hasDietary = Boolean(
    quote.dietaryNeeds ||
    quote.allergens?.length ||
    Object.values(quote.dietaryCounts ?? {}).some(Boolean),
  )
  function download() {
    const csv: (string | number)[][] = [
      [op.supplies, op.quantity, op.measure, op.size, op.packs, labels.sources],
      ...rows.map((row) => [
        row.label,
        row.amount,
        row.unit === 'unit' ? op.unit : row.unit,
        row.size ?? '',
        row.packCount ?? '',
        row.usedIn,
      ]),
    ]
    if (unfinished.length) {
      csv.push([], [labels.gaps, op.servings, op.supplies])
      for (const d of unfinished) {
        csv.push([
          t(d.name),
          d.servings,
          d.unmeasured.length ? d.unmeasured.map((key) => t(key)).join(', ') : op.pending,
        ])
      }
    }
    if (hasDietary) csv.push([], [labels.dietary])
    csv.push([], [op.yieldHint])
    downloadCsv('legado-' + number + '.csv', csv)
  }
  if (!plan.dishes.length) return <p className="purchase-note">{labels.empty}</p>
  return (
    <>
      <div className="purchase-intro">
        <p className="purchase-note">{op.yieldHint}</p>
        {(rows.length > 0 || unfinished.length > 0) && (
          <ActionButton variant="secondary" onPress={download}>
            {messages[language].exportShopping}
          </ActionButton>
        )}
      </div>
      {unfinished.length > 0 && (
        <section className="purchase-gaps">
          <h3>{labels.gaps}</h3>
          <ul>
            {unfinished.map((d) => (
              <li key={d.id}>
                <Link to={'/recipes?dish=' + encodeURIComponent(d.id) + '#recipe-detail'}>
                  {t(d.name)}
                </Link>
                <span>
                  {d.unmeasured.length ? d.unmeasured.map((key) => t(key)).join(', ') : op.pending}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {hasDietary && <p className="purchase-note purchase-dietary">{labels.dietary}</p>}
      {rows.length ? (
        <table className="purchase-table" aria-labelledby="purchases-title">
          <thead>
            <tr>
              <th scope="col">{op.supplies}</th>
              <th scope="col">{op.quantity}</th>
              {hasPacks && <th scope="col">{op.packs}</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  {row.label}
                  {row.usedIn && <small>{row.usedIn}</small>}
                </th>
                <td>{format(row.amount, row.unit)}</td>
                {hasPacks && (
                  <td>
                    {row.size !== null
                      ? row.packCount?.toLocaleString(locale) + ' × ' + format(row.size, row.unit)
                      : '—'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="purchase-note">{op.noYields}</p>
      )}
      <details className="purchase-portions">
        <summary>{op.portions}</summary>
        <p className="purchase-note">{op.basis}</p>
        <dl>
          {plan.dishes.map((d) => (
            <div key={d.id}>
              <dt>{t(d.name)}</dt>
              <dd>{d.servings.toLocaleString(locale)}</dd>
            </div>
          ))}
        </dl>
      </details>
      {confirmed && (
        <Link className="purchase-adjust" to={'/preparation/' + number}>
          {op.prep}
        </Link>
      )}
    </>
  )
}
