import { TextField } from '@legado/brand/controls'
import { type ComponentProps } from 'react'
import { validationMessage } from '../model/validationMessage'
import { useI18n } from '../../../shared/i18n'

type Props = ComponentProps<'input'> & {
  icon: 'name' | 'email' | 'phone'
  label: string
  fixedPrefix?: string
  error?: string
}

export function QuoteField({ icon, label, fixedPrefix, error, ...input }: Props) {
  const { t } = useI18n()
  return (
    <TextField
      {...input}
      fixedPrefix={fixedPrefix}
      error={error && validationMessage(error, t)}
      labelClassName="quote-event-detail-label"
      icon={icon}
      label={label}
    />
  )
}
