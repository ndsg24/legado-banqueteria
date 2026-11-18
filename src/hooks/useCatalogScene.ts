import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { CatalogItem } from '../types/catalog'
import type { CatalogScene } from '../rendering/CatalogScene'

export function useCatalogScene(
  containerRef: RefObject<HTMLDivElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  items: readonly CatalogItem[],
) {
  const sceneRef = useRef<CatalogScene | null>(null)
  const pendingItems = useRef(items)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    let cancelled = false
    const fallback = () => {
      container.dataset.visuals = 'fallback'
    }
    const watchdog = window.setTimeout(() => {
      if (!sceneRef.current) fallback()
    }, 2500)

    import('../rendering/CatalogScene')
      .then(({ CatalogScene }) => {
        if (cancelled) return
        try {
          const scene = new CatalogScene(container, canvas)
          sceneRef.current = scene
          scene.setItems(pendingItems.current)
        } catch {
          fallback()
        }
        window.clearTimeout(watchdog)
      })
      .catch(() => {
        if (!cancelled) fallback()
      })

    return () => {
      cancelled = true
      window.clearTimeout(watchdog)
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [containerRef, canvasRef])

  useEffect(() => {
    pendingItems.current = items
    sceneRef.current?.setItems(items)
  }, [items])
}
