import { useEffect } from 'react'

export function useInitialHash() {
  useEffect(() => {
    const initialHash = window.location.hash
    if (!initialHash) return

    document.querySelector<HTMLElement>(initialHash)?.scrollIntoView()
  }, [])
}
