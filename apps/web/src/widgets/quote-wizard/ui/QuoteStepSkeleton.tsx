import { useI18n } from '../../../shared/i18n'
import { steps, type StepId } from '../model/steps'
import { QuoteStepIcon } from './QuoteStepIcon'

const layouts = {
  event: ['fields', 'preview'],
  menu: ['rail', 'cards'],
  dietary: ['rail', 'cards'],
  table: ['preview', 'list'],
  contact: ['fields'],
  review: ['summary', 'preview', 'list'],
} as const satisfies Record<StepId, readonly string[]>

const lines = { fields: 3, preview: 0, rail: 3, cards: 3, summary: 2, list: 4 }

export function QuoteStepSkeleton({ step }: { step: (typeof steps)[number] }) {
  const { t } = useI18n()
  return (
    <div className="quote-step-skeleton" data-step={step.id}>
      <div className="quote-step-skeleton__status" role="status">
        <QuoteStepIcon step={step.id} />
        {t('quote.steps.loading', { name: t(step.label) })}
      </div>
      <div className="quote-step-skeleton__layout" aria-hidden="true">
        {layouts[step.id].map((block) => (
          <div className="quote-step-skeleton__block" data-block={block} key={block}>
            {Array.from({ length: lines[block] }, (_, index) => (
              <span key={index} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
