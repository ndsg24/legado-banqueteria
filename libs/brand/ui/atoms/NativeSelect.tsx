import type { ComponentProps } from 'react'
import '../../styles/select.css'

export function NativeSelect({ className, ...props }: ComponentProps<'select'>) {
  return <select {...props} className={className ? 'brand-select ' + className : 'brand-select'} />
}
