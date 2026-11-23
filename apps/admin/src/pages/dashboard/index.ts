export { loadDashboard } from './model/loader'

export async function loadDashboardView() {
  const { Dashboard } = await import('./ui/Dashboard')
  return { Component: Dashboard }
}
