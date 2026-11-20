import { useId, useState, type Ref } from 'react'
import { useWatch, type Control } from 'react-hook-form'
import { displayDate, eventLabels, type QuoteRequest } from '../../../entities/quote'
import { dinnerwareStyles } from '../../../entities/table'
import { useI18n } from '../../../shared/i18n'
import { QuoteStepIcon } from './QuoteStepIcon'
import { steps } from '../model/steps'

type Props = {
  control: Control<QuoteRequest>
  step: number
  sent: boolean
  busy: boolean
  onGoTo: (step: number) => void
  ref: Ref<HTMLElement>
}

export function QuoteProgress({ control, step, sent, busy, onGoTo, ref }: Props) {
  const { t, locale } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const listId = useId()
  const [event, guests, place, date, items, dietary, table, name] = useWatch({
    control,
    name: ['event', 'guests', 'location', 'date', 'items', 'dietaryCounts', 'table', 'name'],
  })
  const occasion = [
    event && t(eventLabels[event]),
    Number.isFinite(guests) && guests > 0 && guests + ' ' + t('quote.event.guestUnit'),
  ]
    .filter(Boolean)
    .join(' · ')
  function selectionSummary(quantities: Record<string, number> | undefined) {
    const count = Object.values(quantities ?? {}).filter((quantity) => quantity > 0).length
    if (!count) return ''
    return count + ' ' + t(count === 1 ? 'quote.selection.chosenOne' : 'quote.selection.chosenMany')
  }
  const details: Record<(typeof steps)[number]['id'], string> = {
    event: occasion,
    menu: selectionSummary(items),
    dietary: selectionSummary(dietary),
    table: table ? t(dinnerwareStyles[table.dinnerware].label) : '',
    contact: name?.trim(),
    review: [place, date && displayDate(date, locale, t)].filter(Boolean).join(' · '),
  }

  return (
    <nav className="quote-progress" aria-label={t('quote.steps.label')} ref={ref}>
      <div className="quote-progress__index" data-expanded={expanded}>
        <ol id={listId}>
          {steps.map((part, index) => {
            const featured = index === step
            const completed = index < step || sent
            const detail = (featured || completed) && details[part.id]
            return (
              <li key={part.id} data-featured={featured} data-completed={completed}>
                <button
                  type="button"
                  onClick={() => {
                    setExpanded(false)
                    onGoTo(index)
                  }}
                  disabled={index >= step || sent || busy}
                  aria-current={featured && !sent ? 'step' : undefined}
                  aria-describedby={detail ? listId + part.id : undefined}
                  aria-label={
                    t('quote.steps.stepLabel', { number: index + 1, name: t(part.label) }) +
                    (completed ? t('quote.steps.completed') : '')
                  }
                >
                  <QuoteStepIcon step={part.id} />
                  <span className="quote-progress__folio" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                    {featured && <small> / {String(steps.length).padStart(2, '0')}</small>}
                  </span>
                  <span className="quote-progress__entry">
                    <span className="quote-progress__name">{t(part.label)}</span>
                    {detail && <small id={listId + part.id}>{detail}</small>}
                  </span>
                  {completed && (
                    <span className="quote-progress__check" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ol>
        <button
          className="quote-progress__toggle"
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded(!expanded)}
        >
          {t(expanded ? 'quote.steps.closeIndex' : 'quote.steps.showIndex')}
          <span aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
      </div>
    </nav>
  )
}
