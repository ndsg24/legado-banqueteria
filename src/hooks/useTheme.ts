import { useCallback, useEffect, useState } from 'react'
import { siteConfig } from '../config/site'
import type { Theme } from '../types/theme'

const themeColors: Record<Theme, string> = {
  dark: '#0a0a09',
  light: '#f2f2ef',
}

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(siteConfig.themeStorageKey)
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(siteConfig.themeStorageKey, theme)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', themeColors[theme])
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => current === 'light' ? 'dark' : 'light')
  }, [])

  return { theme, toggleTheme }
}
