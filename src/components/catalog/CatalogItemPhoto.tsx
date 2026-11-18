import type { CSSProperties } from 'react'
import type { CatalogItem } from '../../types/catalog'

type Props = { item: CatalogItem; alt: string; sizes: string; onSettled?: () => void }

export function CatalogItemPhoto({ item, alt, sizes, onSettled }: Props) {
  const base = import.meta.env.BASE_URL
  const bounds = item.imageBounds
  const longest = Math.max(bounds.width, bounds.height)
  const imageStyle = {
    width: `${(item.imageWidth / longest) * 100}%`,
    height: `${(item.imageHeight / longest) * 100}%`,
    left: `${50 - ((bounds.x + bounds.width / 2) / longest) * 100}%`,
    top: `${50 - ((bounds.y + bounds.height / 2) / longest) * 100}%`,
  } satisfies CSSProperties

  return (
    <img
      style={imageStyle}
      src={`${base}${item.imageSmall ?? item.image}`}
      srcSet={
        item.imageSmall && item.imageSmallWidth
          ? `${base}${item.imageSmall} ${item.imageSmallWidth}w, ${base}${item.image} ${item.imageWidth}w`
          : undefined
      }
      sizes={sizes}
      loading="lazy"
      decoding="async"
      width={item.imageWidth}
      height={item.imageHeight}
      alt={alt}
      draggable={false}
      onLoad={onSettled}
      onError={onSettled}
    />
  )
}
