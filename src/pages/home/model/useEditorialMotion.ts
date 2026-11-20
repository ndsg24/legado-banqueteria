import { useEffect, type RefObject } from 'react'
import type { EditorialMotion } from './editorialMotion'

export function useEditorialMotion(root: RefObject<HTMLElement | null>, kind: EditorialMotion) {
  useEffect(() => {
    const element = root.current
    if (!element) return
    let disposed = false
    let stop: (() => void) | undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      void import('./editorialMotion')
        .then(({ startEditorialMotion }) => {
          if (!disposed) stop = startEditorialMotion(element, kind)
        })
        .catch(() => {
          /* The section is also readable without its decorative motion. */
        })
    })
    observer.observe(element)
    return () => {
      disposed = true
      observer.disconnect()
      stop?.()
    }
  }, [root, kind])
}
