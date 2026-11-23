import { useEffect, useState } from 'react'
import { isTheme, type Theme } from './types'

function getInitialTheme(storageKey: string): Theme {
  try {
    const savedTheme = localStorage.getItem(storageKey)
    if (isTheme(savedTheme)) return savedTheme
  } catch {
    /* Follow the device setting when browser storage is unavailable. */
  }

  const current = document.documentElement.dataset.theme
  if (isTheme(current)) return current
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  const canvasColor = getComputedStyle(document.documentElement).getPropertyValue('--canvas').trim()
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', canvasColor)
}

export function initializeTheme(storageKey: string) {
  applyTheme(getInitialTheme(storageKey))
}

export function useTheme(storageKey = 'legado-theme') {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme(storageKey))

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(storageKey, theme)
    } catch {
      /* The selected theme still applies to the open page. */
    }
  }, [theme, storageKey])

  return { theme, setTheme }
}
