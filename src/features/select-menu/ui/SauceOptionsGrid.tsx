import { CatalogItemPhoto } from '../../../entities/menu/ui'
import { useI18n } from '../../../shared/i18n'
import { sauceOptions } from './sauceOptions'

type Props = {
  selected: string
  onChoose: (id: string) => void
  compact?: boolean
  disabled?: boolean
}

export function SauceOptionsGrid({ selected, onChoose, compact = false, disabled }: Props) {
  const { t } = useI18n()
  return (
    <div
      className="sauce-grid"
      data-compact={compact}
      role="group"
      aria-label={t('menu.categories.salsas')}
    >
      {sauceOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          className="sauce-option"
          aria-label={t(option.name)}
          aria-pressed={selected === option.id}
          disabled={disabled}
          onClick={() => onChoose(option.id)}
        >
          <span className="sauce-option__photo">
            <CatalogItemPhoto item={option} sizes={compact ? '48px' : '64px'} alt="" />
          </span>
          <span className="sauce-option__text">{t(option.name)}</span>
          {!compact && <small>{t(option.description)}</small>}
          {selected === option.id && (
            <span className="sauce-option__mark" aria-hidden="true">
              ✓
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
