import { Link, type LinkProps } from 'react-router'

type Props = LinkProps & { variant?: 'primary' | 'secondary' }

export function ActionLink({ className = '', variant = 'primary', ...props }: Props) {
  const base = variant === 'primary' ? 'button--gold' : 'button--secondary'
  return <Link {...props} className={`${base} ${className}`.trimEnd()} />
}
