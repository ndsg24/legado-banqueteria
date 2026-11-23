import { useEffect } from 'react'
import { Outlet, useLoaderData, useNavigation, useRouteLoaderData } from 'react-router'
import { useI18n } from '@legado/brand/i18n'
import { Navigation } from '../widgets/navigation'
import { Preferences } from '../features/preferences'
import type { loadDashboard } from '../pages/dashboard'
import type { Profile } from '../entities/session'
import { messages } from '../shared/config/messages'

export function Shell() {
  const profile = useLoaderData<Profile>()
  const copy = messages[useI18n().language]
  const navigation = useNavigation()
  const dashboard = useRouteLoaderData<typeof loadDashboard>('dashboard')
  useEffect(() => {
    document.title = copy.admin + ' · Legado'
  }, [copy])
  return (
    <Navigation profile={profile} preferences={<Preferences />} dashboardDate={dashboard?.today}>
      <main id="admin-content" tabIndex={-1} aria-busy={navigation.state === 'loading'}>
        <Outlet />
      </main>
    </Navigation>
  )
}
