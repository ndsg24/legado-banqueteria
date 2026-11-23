import type { CSSProperties } from 'react'
import type { CatalogItem } from '@legado/domain/menu/types'

import { type CatalogImageResolver, publicImageUrl } from './image-source'

type Props = {
  resolveImage?: CatalogImageResolver
  item: CatalogItem
  alt: string
  sizes: string
  onSettled?: (loaded: boolean) => void
}

export function CatalogItemPhoto({
  item,
  alt,
  sizes,
  onSettled,
  resolveImage = publicImageUrl,
}: Props) {
  const bounds = item.imageBounds
  const longest = Math.max(bounds.width, bounds.height)
  const imageStyle = {
    width: `${(item.imageWidth / longest) * 100}%`,
    height: `${(item.imageHeight / longest) * 100}%`,
    left: `${50 - ((bounds.x + bounds.width / 2) / longest) * 100}%`,
    top: `${50 - ((bounds.y + bounds.height / 2) / longest) * 100}%`,
  } satisfies CSSProperties

  const thumbnail = item.imageThumbnail && resolveImage(item.imageThumbnail)
  const small = item.imageSmall && resolveImage(item.imageSmall)
  const original = resolveImage(item.image)
  const sources = [
    thumbnail && `${thumbnail} 320w`,
    small && item.imageSmallWidth && `${small} ${item.imageSmallWidth}w`,
    original && `${original} ${item.imageWidth}w`,
  ].filter(Boolean)
  return (
    <img
      style={imageStyle}
      src={small || original || thumbnail}
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
