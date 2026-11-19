import { useEffect, useRef, type RefObject } from 'react'
import type { CatalogItem } from '../../../entities/menu'
import type { CatalogScene } from '../lib/CatalogScene'

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
    const effects = window.matchMedia(
      '(any-hover: hover) and (prefers-reduced-motion: no-preference)',
    )
    async function enhance() {
      try {
        const { CatalogScene } = await import('../lib/CatalogScene')
        if (cancelled || sceneRef.current || !effects.matches || !container || !canvas) return
        const scene = new CatalogScene(container, canvas)
        sceneRef.current = scene
        scene.setItems(pendingItems.current)
      } catch {
        if (!cancelled && container) container.dataset.visuals = 'fallback'
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && effects.matches) {
          observer.disconnect()
          void enhance()
        }
      },
      { rootMargin: '100px' },
    )
    const observe = () => {
      if (effects.matches && !sceneRef.current) observer.observe(container)
      else observer.disconnect()
    }
    observe()
    effects.addEventListener('change', observe)

    return () => {
      cancelled = true
      observer.disconnect()
      effects.removeEventListener('change', observe)
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [containerRef, canvasRef])

  useEffect(() => {
    pendingItems.current = items
    sceneRef.current?.setItems(items)
  }, [items])
}
