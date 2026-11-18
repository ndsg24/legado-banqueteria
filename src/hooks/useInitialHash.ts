import { useLayoutEffect } from 'react'

import { quoteHref } from '../quote/selection'

export function useInitialHash() {
  useLayoutEffect(() => {
    const initialHash = window.location.hash
    if (initialHash === '#cotizar') {
      window.location.replace(quoteHref(new URLSearchParams(window.location.search)))
      return
    }
    if (!initialHash) return

    // Enter at the linked section before revealing the new document.
    document.getElementById(initialHash.slice(1))?.scrollIntoView({
      behavior: 'instant',
      block: 'start',
    })
  }, [])
}
