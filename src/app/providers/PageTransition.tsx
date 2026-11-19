import { useLayoutEffect, useRef, useSyncExternalStore } from 'react'
import type { createBrowserRouter } from 'react-router'

const showAfterMs = 200
const minimumVisibleMs = 420

export function PageTransition({ router }: { router: ReturnType<typeof createBrowserRouter> }) {
  const pending = useSyncExternalStore(router.subscribe, () => {
    const { initialized, navigation, location } = router.state
    return (
      !initialized ||
      Boolean(navigation.location && navigation.location.pathname !== location.pathname)
    )
  })
  const shownAt = useRef<number | null>(null)

  useLayoutEffect(() => {
    const root = document.documentElement
    const app = document.getElementById('root')!
    if (pending && shownAt.current === null) {
      const timer = window.setTimeout(() => {
        shownAt.current = performance.now()
        root.dataset.pageTransition = 'pending'
        app.inert = true
      }, showAfterMs)
      return () => window.clearTimeout(timer)
    }
    if (!pending && shownAt.current !== null) {
      const remaining = Math.max(0, minimumVisibleMs - (performance.now() - shownAt.current))
      const timer = window.setTimeout(() => {
        delete root.dataset.pageTransition
        app.inert = false
        shownAt.current = null
      }, remaining)
      return () => window.clearTimeout(timer)
    }
  }, [pending])

  useLayoutEffect(
    () => () => {
      delete document.documentElement.dataset.pageTransition
      const app = document.getElementById('root')
      if (app) app.inert = false
      shownAt.current = null
    },
    [],
  )
  return null
}
