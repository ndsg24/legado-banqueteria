import { CatalogItemPhoto } from '../../../entities/menu/ui'
import { useState } from 'react'
import type { CatalogItem } from '../../../entities/menu'

type CatalogDishStageProps = {
  item: CatalogItem
}

export function CatalogDishStage({ item }: CatalogDishStageProps) {
  const [imageSettled, setImageSettled] = useState(false)

  return (
    <div className="catalog-card__image" data-product={item.id} data-image-settled={imageSettled}>
      <div className="catalog-card__fallback">
        <CatalogItemPhoto
          item={item}
          alt=""
          onSettled={() => setImageSettled(true)}
          sizes="(max-width: 600px) 42vw, 220px"
        />
      </div>
      {!imageSettled && <span className="catalog-card__skeleton" aria-hidden="true" />}
    </div>
  )
}
