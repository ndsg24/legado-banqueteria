import { useI18n } from '../i18n'
import { EditorialArrow } from '../ui/atoms/EditorialArrow'
import '../styles/dish-labels.css'

export function DishDetailsLabel() {
  const { t } = useI18n()
  return (
    <span className="quote-dish__details-label">
      {t('quote.selection.viewDetails')} <EditorialArrow direction="up-right" />
    </span>
  )
}
