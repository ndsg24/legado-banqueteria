import { useRef } from 'react'
import { useCatalogScene } from '../../hooks/useCatalogScene'
import type { CatalogItem } from '../../types/catalog'
import { CatalogCard } from './CatalogCard'

type CatalogProductGridProps = {
  items: readonly CatalogItem[]
  selectedIds: readonly string[]
  onToggle: (id: string) => void
}

export function CatalogProductGrid({ items, selectedIds, onToggle }: CatalogProductGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useCatalogScene(containerRef, canvasRef, items)

  return (
    <div ref={containerRef} className="catalog__grid" data-visuals="loading">
      <canvas ref={canvasRef} className="catalog__visual-layer" aria-hidden="true" />
      {items.map((item, index) => (
        <CatalogCard
          key={item.id}
          item={item}
          index={index}
          selected={selectedIds.includes(item.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
