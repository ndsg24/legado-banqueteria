import { useSyncExternalStore } from 'react'

const compactFilter = '(max-width: 950px)'
const tablet = '(any-pointer: coarse) and (max-width: 1440px)'

function getLayout() {
  if (matchMedia(compactFilter).matches) return 'compact'
  return matchMedia(tablet).matches ? 'tablet' : 'desktop'
}

function subscribe(notify: () => void) {
  const queries = [matchMedia(compactFilter), matchMedia(tablet)]
  for (const query of queries) query.addEventListener('change', notify)
  return () => {
    for (const query of queries) query.removeEventListener('change', notify)
  }
}

export function useCatalogLayout() {
  return useSyncExternalStore(subscribe, getLayout, () => 'desktop' as const)
}
