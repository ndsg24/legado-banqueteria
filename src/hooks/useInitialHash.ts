import { useEffect } from 'react'

import { quoteHref } from '../quote/selection'

export function useInitialHash() {
  useEffect(() => {
    const initialHash = window.location.hash
    if (initialHash === '#cotizar') {
      window.location.replace(quoteHref(new URLSearchParams(window.location.search)))
      return
    }
    if (!initialHash) return

    document.querySelector<HTMLElement>(initialHash)?.scrollIntoView()
  }, [])
}
