import { useId, type ComponentProps } from 'react'
import { validationMessage } from '../model/validationMessage'
import { useI18n } from '../../../shared/i18n'

import { QuoteDetailIcon } from './QuoteDetailIcon'

type Props = ComponentProps<'input'> & {
  icon: 'name' | 'email' | 'phone'
  label: string
  fixedPrefix?: string
  error?: string
}

export function QuoteField({ icon, label, fixedPrefix, error, ...input }: Props) {
  const { t } = useI18n()
  const id = useId()
  const description = [fixedPrefix && id + '-prefix', error && id + '-error']
    .filter(Boolean)
    .join(' ')
  const control = (
    <input {...input} id={id} aria-invalid={!!error} aria-describedby={description || undefined} />
  )
  return (
    <div className="quote-field">
      <label className="quote-event-detail-label" htmlFor={id}>
        <QuoteDetailIcon kind={icon} />
        {label}
      </label>
      {fixedPrefix ? (
        <div className="quote-field__prefixed">
          <span id={id + '-prefix'}>{fixedPrefix}</span>
          {control}
        </div>
      ) : (
        control
      )}
      {error && (
        <small id={id + '-error'} className="quote-error" role="alert">
          {validationMessage(error, t)}
        </small>
      )}
    </div>
  )
}
