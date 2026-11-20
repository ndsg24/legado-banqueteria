import { useI18n } from '../../../shared/i18n'
import type { StepId } from '../model/steps'

export function QuoteStepSkeleton({ step }: { step: StepId }) {
  const { t } = useI18n()
  const cards = step === 'menu' || step === 'dietary'
  return (
    <div
      className="quote-step-skeleton"
      data-cards={cards}
      role="status"
      aria-label={t('common.loader.label')}
    >
      <span aria-hidden="true" />
      {cards && (
        <>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </>
      )}
    </div>
  )
}
