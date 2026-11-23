import { ReviewActionIcon } from './ReviewActionIcon'
import { ActionButton } from '../../../shared/ui/ActionButton'
import { steps, type StepId } from '../model/steps'
import { SettingSample } from './SettingSample'
import { EventIcon } from './EventIcon'
import { DetailIcon } from '@legado/brand/controls'
import { MenuTasting } from './MenuTasting'
import { QuoteStepIcon } from './QuoteStepIcon'
import { DietaryModel } from './DietaryModel'
import { useI18n } from '../../../shared/i18n'
import { useImperativeHandle, useRef, type Ref } from 'react'
import {
  type QuoteRequest,
  displayDate,
  dietaryMenuGroups,
  eventLabels,
  menuGroups,
  settingEntries,
} from '../../../entities/quote'
import { layoutDetails, type TableDesign } from '../../../entities/table'
import { useTableScene, SeatingPlan, capturePlan } from '../../../features/preview-table'

export type TablePicture = { capture: () => string | undefined | Promise<string> }

function ReviewTable({ design, picture }: { design: TableDesign; picture: Ref<TablePicture> }) {
  const { t } = useI18n()

  const { canvasRef, status, capturePreview } = useTableScene(design)
  const plan = useRef<SVGSVGElement>(null)
  useImperativeHandle(
    picture,
    () => ({
      capture: () =>
        capturePreview() ??
        (plan.current ? capturePlan(plan.current, 1200, 'image/jpeg') : undefined),
    }),
    [capturePreview],
  )
  return (
    <div className="quote-mount__scene">
      <canvas
        ref={canvasRef}
        aria-hidden={status !== 'ready'}
        aria-label={
          t('quote.setting.view') +
          ' ' +
          (design.roundSeats?.[0] ?? design.chairs) +
          ' ' +
          t('table.plan.seatsUnit')
        }
      />
      {status !== 'ready' && (
        <div className="quote-review__fallback">
          <SeatingPlan design={design} planRef={plan} />
        </div>
      )}
    </div>
  )
}

function ReviewPlan({ design, picture }: { design: TableDesign; picture: Ref<TablePicture> }) {
  const plan = useRef<SVGSVGElement>(null)
  useImperativeHandle(
    picture,
    () => ({
      capture: () => (plan.current ? capturePlan(plan.current, 1200, 'image/jpeg') : undefined),
    }),
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

function OverviewFact({
  kind,
  label,
  value,
}: {
  kind: 'guests' | 'location' | 'date' | 'email' | 'phone'
  label: string
  value: string | number
}) {
  return (
    <div title={label}>
      <dt>
        <DetailIcon kind={kind} />
        <span>{label}</span>
      </dt>
      <dd>{value}</dd>
    </div>
  )
}

export function QuoteReview({
  quote,
  picture,
  onEdit,
}: {
  quote: QuoteRequest
  picture: Ref<TablePicture>
  onEdit?: (step: StepId) => void
}) {
  const { t, locale } = useI18n()

  const design = quote.table
  const dietary = dietaryMenuGroups(quote, t)
  const hasDietary = dietary.length > 0 || !!quote.dietaryNeeds
  const menu = menuGroups(quote, t)
  function edit(id: StepId) {
    const step = steps.find((part) => part.id === id)
    if (!onEdit || !step) return null
    return (
      <ActionButton
        type="button"
        variant="secondary"
        className="quote-review__edit"
        aria-label={t('quote.review.editSection', { name: t(step.label) })}
        onPress={() => onEdit(id)}
      >
        <ReviewActionIcon action="edit" />
        {t('quote.review.edit')}
      </ActionButton>
    )
  }
  return (
    <div className="quote-review">
      <div className="quote-review__overview">
        <section>
          <EventIcon event={quote.event} />
          <div>
            <header className="quote-review__section-heading">
              <h3>{t('quote.review.event')}</h3>
              {edit('event')}
            </header>
            <strong className="quote-review__identity">{t(eventLabels[quote.event])}</strong>
            <dl className="quote-review__meta">
              <OverviewFact kind="guests" label={t('quote.review.guests')} value={quote.guests} />
              <OverviewFact
                kind="location"
                label={t('quote.review.venue')}
                value={quote.location}
              />
              <OverviewFact
                kind="date"
                label={t('quote.review.date')}
                value={displayDate(quote.date, locale, t)}
              />
            </dl>
          </div>
        </section>
        <section>
          <DetailIcon kind="name" />
          <div>
            <header className="quote-review__section-heading">
              <h3>{t('quote.review.contact')}</h3>
              {edit('contact')}
            </header>
            <strong className="quote-review__identity">{quote.name}</strong>
            <dl className="quote-review__meta">
              <OverviewFact kind="email" label={t('quote.review.email')} value={quote.email} />
              {quote.phone && (
                <OverviewFact kind="phone" label={t('quote.review.phone')} value={quote.phone} />
              )}
            </dl>
          </div>
        </section>
      </div>
      <div className="quote-review__service">
        {menu.length === 0 && (
          <section className="quote-review__panel">
            <header className="quote-review__section-heading">
              <h3>{t('quote.review.dishes')}</h3>
              {edit('menu')}
            </header>
            <p>{t('quote.review.menuPending')}</p>
          </section>
        )}
        {menu.length > 0 && (
          <MenuTasting menu={menu} design={quote.table} editAction={edit('menu')} />
        )}
        <section className="quote-review__panel quote-review__setting">
          <header className="quote-review__section-heading">
            <h3>
              <QuoteStepIcon step="table" />
              {t('quote.review.setting')}
            </h3>
            {edit('table')}
          </header>
          {design ? (
            <div className="quote-review__table">
              {design.roundTables !== 1 || design.headSeats > 0 ? (
                <ReviewPlan design={design} picture={picture} />
              ) : (
                <ReviewTable design={design} picture={picture} />
              )}
              <div>
                <Details rows={layoutDetails(design, t)} />
                <section className="quote-review__finishes">
                  <h4>{t('table.view.detail')}</h4>
                  <dl className="quote-review__samples">
                    {settingEntries(design, t).map(({ key, label, value }) => (
                      <div key={key}>
                        <dt>
                          <span aria-hidden="true">
                            <SettingSample part={key} design={design} />
                          </span>
                          {label}
                        </dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </div>
            </div>
          ) : (
            <p>{t('quote.review.tablePending')}</p>
          )}
        </section>
        {(hasDietary || onEdit) && (
          <section className="quote-review__panel quote-review__dietary">
            <header className="quote-review__section-heading">
              <h3>
                <QuoteStepIcon step="dietary" />
                {t('quote.review.dietaryNeeds')}
              </h3>
              {edit('dietary')}
            </header>
            {!hasDietary && <p>{t('quote.review.noDietary')}</p>}
            <div className="quote-review__dietary-groups">
              {dietary.map((group) => (
                <div className="quote-review__group" key={group.name}>
                  <h4>{group.name}</h4>
                  <ul>
                    {group.entries.map(({ id, name, quantity }) => (
                      <li key={id}>
                        <DietaryModel id={id} />
                        <span>{name}</span>
                        {quantity && <strong>{quantity}</strong>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {quote.dietaryNeeds && (
                <p className="quote-review__dietary-note">{quote.dietaryNeeds}</p>
              )}
            </div>
          </section>
        )}
        {quote.notes && (
          <section className="quote-review__panel quote-review__notes">
            <h3>{t('quote.review.details')}</h3>
            <p>{quote.notes}</p>
          </section>
        )}
      </div>
    </div>
  )
}
