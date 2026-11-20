import type { CSSProperties } from 'react'
import type { CatalogItem } from '../model/types'

type Props = {
  item: CatalogItem
  alt: string
  sizes: string
  onSettled?: (loaded: boolean) => void
}

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

  const sources = [
    item.imageThumbnail && `${base}${item.imageThumbnail} 320w`,
    item.imageSmall && item.imageSmallWidth && `${base}${item.imageSmall} ${item.imageSmallWidth}w`,
    `${base}${item.image} ${item.imageWidth}w`,
  ].filter(Boolean)
  return (
    <img
      style={imageStyle}
      src={`${base}${item.imageSmall ?? item.image}`}
      srcSet={sources.length > 1 ? sources.join(', ') : undefined}
      sizes={'auto, ' + sizes}
      loading="lazy"
      decoding="async"
      width={item.imageWidth}
      height={item.imageHeight}
      alt={alt}
      draggable={false}
      onLoad={onSettled && (() => onSettled(true))}
      onError={onSettled && (() => onSettled(false))}
    />
  )
}
