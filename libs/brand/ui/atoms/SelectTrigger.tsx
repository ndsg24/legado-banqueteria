import { Button, type ButtonProps } from 'react-aria-components'
import type { Ref } from 'react'
import '../../styles/select.css'

type Props = Omit<ButtonProps, 'className'> & {
  className?: string
  ref?: Ref<HTMLButtonElement>
}

export function SelectTrigger({ className, ...props }: Props) {
  return <Button {...props} className={className ? 'brand-select ' + className : 'brand-select'} />
}
