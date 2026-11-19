import { validationMessage } from '../model/validationMessage'
import { useI18n } from '../../../shared/i18n'
import type { ReactNode } from 'react'

export function QuoteField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  const { t } = useI18n()

  return (
    <label className="quote-field">
      <span>{label}</span>
      {children}
      <small className="quote-error" role={error ? 'alert' : undefined}>
        {validationMessage(error, t)}
      </small>
    </label>
  )
}
