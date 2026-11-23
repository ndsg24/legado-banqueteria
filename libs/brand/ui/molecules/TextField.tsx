import { useId, type ComponentProps, type ReactNode } from 'react'

import { DetailIcon } from '../atoms/DetailIcon'

type Props = ComponentProps<'input'> & {
  label: ReactNode
  icon?: 'name' | 'email' | 'phone' | 'password'
  labelClassName?: string
  fixedPrefix?: string
  error?: string
}
export function TextField({
  label,
  labelClassName,
  icon,
  fixedPrefix,
  error,
  id: provided,
  ...input
}: Props) {
  const generated = useId()
  const id = provided ?? generated
  const description = [fixedPrefix && id + '-prefix', error && id + '-error']
    .filter(Boolean)
    .join(' ')
  const control = (
    <input {...input} id={id} aria-invalid={!!error} aria-describedby={description || undefined} />
  )
  return (
    <div className="quote-field brand-field">
      <label className={labelClassName} htmlFor={id}>
        {icon && <DetailIcon kind={icon} />}
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
          {error}
        </small>
      )}
    </div>
  )
}
