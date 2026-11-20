import { useI18n } from '../../../shared/i18n'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'
import './dish-labels.css'

export function DishDetailsLabel() {
  const { t } = useI18n()
  return (
    <span className="quote-dish__details-label">
      {t('quote.selection.viewDetails')} <EditorialArrow direction="up-right" />
    </span>
  )
}
