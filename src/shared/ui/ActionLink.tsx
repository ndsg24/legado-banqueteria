import { Link, type LinkProps } from 'react-router'

export function ActionLink({ className = '', ...props }: LinkProps) {
  return <Link {...props} className={`button--gold ${className}`.trimEnd()} />
}
