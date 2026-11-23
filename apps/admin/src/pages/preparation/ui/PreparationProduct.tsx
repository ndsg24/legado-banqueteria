import { CategoryMotif } from '@legado/brand/catalog'
import type { ReactNode } from 'react'

export function PreparationProduct({
  name,
  photo,
  atlasPosition,
  details,
  children,
}: {
  name: string
  photo?: string
  atlasPosition?: string
  details?: string
  children?: ReactNode
}) {
  return (
    <span className="prep-product">
      <span className="prep-product__photo" aria-hidden="true">
        {photo ? (
          <img alt="" src={photo} width="56" height="56" loading="lazy" />
        ) : atlasPosition ? (
          <span className="prep-product__reference" style={{ backgroundPosition: atlasPosition }} />
        ) : (
          <CategoryMotif categoryId="guarniciones" />
        )}
      </span>
      <span className="prep-product__text">
        <strong>{name}</strong>
        {children}
        {details && <small>{details}</small>}
      </span>
    </span>
  )
}
