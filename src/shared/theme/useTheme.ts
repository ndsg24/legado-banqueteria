import { useEffect, useState } from 'react'
import { siteConfig } from '../config/site'
import { isTheme, type Theme } from './types'

function getInitialTheme(): Theme {
  try {
    const savedTheme = localStorage.getItem(siteConfig.themeStorageKey)
    if (isTheme(savedTheme)) return savedTheme
  } catch {
    /* Follow the device setting when browser storage is unavailable. */
  }

  const current = document.documentElement.dataset.theme
  if (isTheme(current)) return current
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
    const canvasColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--canvas')
      .trim()
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', canvasColor)
  }, [theme])

  return { theme, setTheme }
}
