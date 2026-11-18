import { useState, type CSSProperties } from 'react'
import type { CatalogItem } from '../../types/catalog'

type CatalogDishStageProps = {
  item: CatalogItem
  index: number
  selected: boolean
  onToggle: (id: string) => void
}

export function CatalogDishStage({ item, index, selected, onToggle }: CatalogDishStageProps) {
  const [imageSettled, setImageSettled] = useState(false)
  const bounds = item.imageBounds
  const longest = Math.max(bounds.width, bounds.height)
  const imageStyle = {
    width: `${item.imageWidth / longest * 100}%`,
    height: `${item.imageHeight / longest * 100}%`,
    left: `${50 - (bounds.x + bounds.width / 2) / longest * 100}%`,
    top: `${50 - (bounds.y + bounds.height / 2) / longest * 100}%`,
  } satisfies CSSProperties

  return (
    <div className="catalog-card__image" data-product={item.id} data-image-settled={imageSettled}>
      <div className="catalog-card__fallback">
        <img
          style={imageStyle}
          src={`${import.meta.env.BASE_URL}${item.imageSmall ?? item.image}`}
          srcSet={item.imageSmall && item.imageSmallWidth
            ? `${import.meta.env.BASE_URL}${item.imageSmall} ${item.imageSmallWidth}w, ${import.meta.env.BASE_URL}${item.image} ${item.imageWidth}w`
            : undefined}
          sizes="(max-width: 760px) calc((100vw - 60px) / 2), (max-width: 1100px) calc((100vw - 128px) / 3), 330px"
          loading="lazy"
          decoding="async"
          width={item.imageWidth}
          height={item.imageHeight}
          alt={item.name}
          draggable={false}
          onLoad={() => setImageSettled(true)}
          onError={() => setImageSettled(true)}
        />
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
