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
  return (
    <label className="quote-field">
      <span>{label}</span>
      {children}
      <small className="quote-error" role={error ? 'alert' : undefined}>
        {error}
      </small>
    </label>
  )
}
