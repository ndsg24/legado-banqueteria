export { loadQuoteDossier } from './model/loader'
export { updateQuoteStatus } from './model/status-action'

export async function loadDossierView() {
  const { Detail } = await import('./ui/Detail')
  return { Component: Detail }
}
