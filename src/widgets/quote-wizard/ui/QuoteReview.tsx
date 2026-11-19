import { useI18n } from '../../../shared/i18n'
import { useImperativeHandle, useRef, type Ref } from 'react'
import {
  type QuoteRequest,
  contactDetails,
  eventDetails,
  menuGroups,
  tableDetails,
} from '../../../entities/quote'
import type { TableDesign } from '../../../entities/table'
import { useTableScene, SeatingPlan, capturePlan } from '../../../features/preview-table'
import { CatalogItemPhoto } from '../../../entities/menu/ui'

export type TablePicture = { capture: () => string | undefined | Promise<string> }

function ReviewTable({ design, picture }: { design: TableDesign; picture: Ref<TablePicture> }) {
  const { t } = useI18n()

  const { canvasRef, status, capturePreview } = useTableScene(design)
  useImperativeHandle(picture, () => ({ capture: capturePreview }), [capturePreview])
  return (
    <div className="quote-mount__scene">
      <canvas
        ref={canvasRef}
        aria-label={
          t('quote.setting.view') +
          ' ' +
          (design.roundSeats?.[0] ?? design.chairs) +
          ' ' +
          t('table.plan.seatsUnit')
        }
      />
      {status !== 'ready' && (
        <span role="status">
          {status === 'error' ? t('quote.setting.fallback') : t('table.view.loading')}
        </span>
      )}
    </div>
  )
}

function ReviewPlan({ design, picture }: { design: TableDesign; picture: Ref<TablePicture> }) {
  const plan = useRef<SVGSVGElement>(null)
  useImperativeHandle(
    picture,
    () => ({ capture: () => (plan.current ? capturePlan(plan.current, 1200) : undefined) }),
    [],
  )
  return <SeatingPlan design={design} planRef={plan} />
}

function Details({ rows }: { rows: string[][] }) {
  return (
    <dl className="quote-facts">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function QuoteReview({
  quote,
  picture,
}: {
  quote: QuoteRequest
  picture: Ref<TablePicture>
}) {
  const { t, locale } = useI18n()

  const groups = menuGroups(quote.items, quote.sauces, t)
  return (
    <div className="quote-review">
      <section>
        <h3>{t('quote.review.event')}</h3>
        <Details rows={eventDetails(quote, locale, t)} />
      </section>
      <section>
        <h3>{t('quote.review.contact')}</h3>
        <Details rows={contactDetails(quote, t)} />
      </section>
      <section>
        <h3>{t('quote.review.dishes')}</h3>
        {groups.length === 0 && <p>{t('quote.review.menuPending')}</p>}
        {groups.map((group) => (
          <div key={group.name} className="quote-review__group">
            <h4>{group.name}</h4>
            <ul>
              {group.entries.map(({ item, name, quantity }) => (
                <li key={item.id}>
                  <span className="quote-summary__photo">
                    <CatalogItemPhoto item={item} alt="" sizes="44px" />
                  </span>
                  <span>{name}</span>
                  <strong>{quantity}</strong>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section>
        <h3>{t('quote.review.setting')}</h3>
        {quote.table ? (
          <>
            {quote.table.roundTables !== 1 || quote.table.headSeats > 0 ? (
              <ReviewPlan design={quote.table} picture={picture} />
            ) : (
              <ReviewTable design={quote.table} picture={picture} />
            )}
            <Details rows={tableDetails(quote.table, t)} />
          </>
        ) : (
          <p>{t('quote.review.tablePending')}</p>
        )}
      </section>
      {quote.notes && (
        <section className="quote-review__notes">
          <h3>{t('quote.review.details')}</h3>
          <p>{quote.notes}</p>
        </section>
      )}
    </div>
  )
}
