import { useI18n } from '../../shared/i18n'
import { Link, Outlet, ScrollRestoration } from 'react-router'
import { RouteMetadata } from './RouteMetadata'

export function Layout() {
  return (
    <>
      <RouteMetadata />
      <Outlet />
      <ScrollRestoration storageKey="legado-scroll" />
    </>
  )
}

export function RouteError() {
  const { t } = useI18n()

  return (
    <main>
      <h1>{t('common.nav.pageError')}</h1>
      <Link to="/">{t('common.nav.backHome')}</Link>
    </main>
  )
}
