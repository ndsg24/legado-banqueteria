import { Button, type ButtonProps } from 'react-aria-components'

type Props = Omit<ButtonProps, 'className'> & {
  variant?: 'primary' | 'secondary'
  className?: string
}

export function ActionButton({ variant = 'primary', className = '', ...props }: Props) {
  const base = variant === 'primary' ? 'button--gold' : 'button--secondary'
  return <Button {...props} className={`${base} ${className}`.trimEnd()} />
}
