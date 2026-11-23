import { useLayoutEffect, useRef, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import type { createBrowserRouter } from 'react-router'
import { useI18n } from '../../i18n'
import '../../styles/page-transition.css'

const showAfterMs = 200
const minimumVisibleMs = 420

export function RouterPageTransition({
  router,
  includeDataUpdates = false,
}: {
  router: ReturnType<typeof createBrowserRouter>
  includeDataUpdates?: boolean
}) {
  const pending = useSyncExternalStore(router.subscribe, () => {
    const { initialized, navigation, location, revalidation } = router.state
    if (!initialized) return true
    if (includeDataUpdates) return navigation.state !== 'idle' || revalidation !== 'idle'
    return Boolean(navigation.location && navigation.location.pathname !== location.pathname)
  })
  return <PageTransition pending={pending} />
}

export function PageTransition({ pending }: { pending: boolean }) {
  const { t } = useI18n()
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
  return createPortal(
    <div className="page-transition" role="status" aria-label={t('common.loader.label')}>
      <div className="page-transition__content">
        <svg className="page-transition__mark" aria-hidden="true" viewBox="0 0 160 160">
          <circle className="page-transition__ring" cx="80" cy="80" r="72" />
          <circle
            className="page-transition__orbit"
            cx="80"
            cy="80"
            r="72"
            strokeDasharray="72 380.4"
          />
          <path
            className="page-transition__draw"
            pathLength="1"
            d="M42 95h76M48 88a32 32 0 0 1 64 0H48Zm32-32v-7m-5 0h10M54 103h52"
          />
          <path className="page-transition__steam" d="M68 41c-7-7 7-8 0-15m24 15c-7-7 7-8 0-15" />
        </svg>
        <span className="page-transition__brand">LEGADO</span>
        <span className="page-transition__caption">{t('common.loader.caption')}</span>
      </div>
    </div>,
    document.body,
  )
}
