import { useI18n } from '../i18n'
import { useState } from 'react'
import './quantity.css'

type Props = {
  name: string
  labels?: { quantity: string; add: string; subtract: string }
  quantity: number
  max?: number
  onChange: (quantity: number) => void
}

export function QuantityControl({
  name,
  labels,
  quantity,
  max = Number.MAX_SAFE_INTEGER,
  onChange,
}: Props) {
  const { t } = useI18n()

  const [draft, setDraft] = useState<string | null>(null)
  return (
    <div
      className="quantity-control"
      role="group"
      aria-label={labels?.quantity ?? t('common.quantity.quantity', { name })}
    >
      <button
        type="button"
        aria-label={labels?.subtract ?? t('common.quantity.subtract', { name })}
        disabled={!quantity}
        onClick={() => onChange(quantity - 1)}
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="0"
        aria-label={labels?.quantity ?? t('common.quantity.quantity', { name })}
        value={draft ?? quantity}
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => {
          const text = event.target.value
          if (text === '') {
            setDraft('')
            return
          }
          if (/^\d+$/.test(text) && Number.isSafeInteger(Number(text))) {
            setDraft(null)
            onChange(Math.min(Number(text), max))
          }
        }}
        onBlur={() => setDraft(null)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            event.currentTarget.blur()
          }
        }}
      />
      <button
        type="button"
        aria-label={labels?.add ?? t('common.quantity.add', { name })}
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
      >
        +
      </button>
    </div>
  )
}
