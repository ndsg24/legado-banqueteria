import type { ReactNode } from 'react'

type PageHeadingProps = {
  title: ReactNode
  id?: string
  titleInNavigation?: boolean
  children?: ReactNode
}

export function PageHeading({ title, id, titleInNavigation, children }: PageHeadingProps) {
  return (
    <header className="admin-page-heading">
      <h1 id={id} className={titleInNavigation ? 'admin-visually-hidden' : undefined}>
        {title}
      </h1>
      {children}
    </header>
  )
}
