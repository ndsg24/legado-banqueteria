import { useRef } from 'react'
import { useCatalogScene } from '../model/useCatalogScene'
import type { CatalogItem } from '../../../entities/menu'
import { CatalogCard } from './CatalogCard'

type CatalogProductGridProps = {
  items: readonly CatalogItem[]
}

export function CatalogProductGrid({ items }: CatalogProductGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useCatalogScene(containerRef, canvasRef, items)

  return (
    <div ref={containerRef} className="catalog__grid" data-visuals="fallback">
      <canvas ref={canvasRef} className="catalog__visual-layer" aria-hidden="true" />
      {items.map((item, index) => (
        <CatalogCard key={item.id} item={item} index={index} />
      ))}
    </div>
  )
}
