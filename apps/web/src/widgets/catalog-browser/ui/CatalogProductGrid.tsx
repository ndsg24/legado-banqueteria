import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { useCatalogScene } from '../model/useCatalogScene'
import type { CatalogCategory } from '../../../entities/menu'
import { CatalogCard } from '@legado/brand/catalog'

const CatalogDishDetailsDialog = lazy(() =>
  import('@legado/brand/dish-details').then(({ CatalogDishDetailsDialog }) => ({
    default: CatalogDishDetailsDialog,
  })),
)

export function CatalogProductGrid({
  categories,
  showCategory,
}: {
  categories: readonly CatalogCategory[]
  showCategory: boolean
}) {
  const dishes = useMemo(
    () => categories.flatMap((category) => category.items.map((item) => ({ item, category }))),
    [categories],
  )
  const items = useMemo(() => dishes.map((dish) => dish.item), [dishes])
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useCatalogScene(containerRef, canvasRef, items)
  const [openId, setOpenId] = useState<string | null>(null)
  const index = items.findIndex((item) => item.id === openId)
  const item = items[index]
  if (openId && !item) setOpenId(null)
  return (
    <>
      <div ref={containerRef} className="catalog__grid" data-visuals="fallback">
        <canvas ref={canvasRef} className="catalog__visual-layer" aria-hidden="true" />
        {dishes.map(({ item, category }) => (
          <CatalogCard
            key={item.id}
            showCategory={showCategory}
            category={category}
            item={item}
            onOpen={() => setOpenId(item.id)}
          />
        ))}
      </div>
      {item && (
        <Suspense fallback={null}>
          <CatalogDishDetailsDialog
            item={item}
            category={dishes[index].category}
            onTurn={(direction) =>
              setOpenId(items[(index + direction + items.length) % items.length].id)
            }
            onClose={() => setOpenId(null)}
          />
        </Suspense>
      )}
    </>
  )
}
