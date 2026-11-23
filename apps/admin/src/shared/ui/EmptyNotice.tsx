import type { ReactNode } from 'react'
import { DetailIcon } from '@legado/brand/controls'

type Props = {
  icon: 'date' | 'email' | 'guests'
  children: ReactNode
}

export function EmptyNotice({ icon, children }: Props) {
  return (
    <div className="empty-notice" role="status">
      <span className="empty-notice-mark">
        <DetailIcon kind={icon} />
      </span>
      <p>{children}</p>
    </div>
  )
}
