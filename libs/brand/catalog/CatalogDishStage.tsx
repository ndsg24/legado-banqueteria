import { CatalogItemPhoto } from './CatalogItemPhoto'
import type { CatalogImageResolver } from './image-source'
import { useState } from 'react'
import type { CatalogItem } from '@legado/domain/menu/types'

type CatalogDishStageProps = {
  item: CatalogItem
  resolveImage?: CatalogImageResolver
}

export function CatalogDishStage({ item, resolveImage }: CatalogDishStageProps) {
  const [imageSettled, setImageSettled] = useState(false)

  return (
    <div className="catalog-card__image" data-product={item.id} data-image-settled={imageSettled}>
      <div className="catalog-card__fallback">
        <CatalogItemPhoto
          item={item}
          resolveImage={resolveImage}
          alt=""
          onSettled={() => setImageSettled(true)}
          sizes="(max-width: 600px) 42vw, 220px"
        />
      </div>
      {!imageSettled && <span className="catalog-card__skeleton" aria-hidden="true" />}
    </div>
  )
}
