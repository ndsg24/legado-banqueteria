import type { ReactNode } from 'react'
import { useI18n } from '../../../shared/i18n'

type Props = {
  label: string
  icon: ReactNode
  count: number
  active: boolean
  onSelect: () => void
}

export function SelectionCategory({ label, icon, count, active, onSelect }: Props) {
  const { t } = useI18n()
  return (
    <button
      type="button"
      aria-label={label}
      aria-description={
        count
          ? count +
            ' ' +
            t(count === 1 ? 'quote.selection.chosenOne' : 'quote.selection.chosenMany')
          : undefined
      }
      aria-pressed={active}
      onClick={onSelect}
    >
      <span className="quote-menu__service-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
      {count > 0 && (
        <small className="quote-menu__service-count" aria-hidden="true">
          {count}
        </small>
      )}
    </button>
  )
}
