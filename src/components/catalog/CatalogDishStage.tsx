import { CatalogItemPhoto } from './CatalogItemPhoto'
import { useState } from 'react'
import type { CatalogItem } from '../../types/catalog'

type CatalogDishStageProps = {
  item: CatalogItem
  index: number
}

export function CatalogDishStage({ item, index }: CatalogDishStageProps) {
  const [imageSettled, setImageSettled] = useState(false)

  return (
    <div className="catalog-card__image" data-product={item.id} data-image-settled={imageSettled}>
      <div className="catalog-card__fallback">
        <CatalogItemPhoto item={item} alt={item.name} onSettled={() => setImageSettled(true)}
          sizes="(max-width: 760px) calc((100vw - 60px) / 2), (max-width: 1100px) calc((100vw - 128px) / 3), 330px" />
      </div>
      <span className="catalog-card__index">{String(index + 1).padStart(2, '0')}</span>
    </div>
  )
}
