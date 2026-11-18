import { CatalogItemPhoto } from './CatalogItemPhoto'
import { useState } from 'react'
import type { CatalogItem } from '../../types/catalog'

type CatalogDishStageProps = {
  item: CatalogItem
  index: number
  selected: boolean
  onToggle: (id: string) => void
}

export function CatalogDishStage({ item, index, selected, onToggle }: CatalogDishStageProps) {
  const [imageSettled, setImageSettled] = useState(false)

  return (
    <div className="catalog-card__image" data-product={item.id} data-image-settled={imageSettled}>
      <div className="catalog-card__fallback">
        <CatalogItemPhoto item={item} alt={item.name} onSettled={() => setImageSettled(true)}
          sizes="(max-width: 760px) calc((100vw - 60px) / 2), (max-width: 1100px) calc((100vw - 128px) / 3), 330px" />
      </div>
      <span className="catalog-card__index">{String(index + 1).padStart(2, '0')}</span>
      <button
        type="button"
        className="catalog-card__select"
        aria-pressed={selected}
        aria-label={`${selected ? 'Quitar' : 'Añadir'} ${item.name} ${selected ? 'de' : 'a'} mi selección`}
        onClick={() => onToggle(item.id)}
      >
        {selected ? '✓' : '+'}
      </button>
    </div>
  )
}
