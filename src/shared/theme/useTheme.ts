import { useCallback, useEffect, useState } from 'react'
import { siteConfig } from '../config/site'
import type { Theme } from './types'

const themeColors: Record<Theme, string> = {
  dark: '#0a0a09',
  light: '#f2f2ef',
}

function getInitialTheme(): Theme {
  try {
    const savedTheme = localStorage.getItem(siteConfig.themeStorageKey)
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  } catch {
    /* Follow the device setting when browser storage is unavailable. */
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(siteConfig.themeStorageKey, theme)
    } catch {
      /* The selected theme still applies to the open page. */
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[theme])
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }, [])

  return { theme, toggleTheme }
}
