import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { LanguageContext } from './context'
import { isLanguage, locales, spanish, translator, type Language, type Translate } from './messages'

const storageKey = 'legado-language'
const catalogs = {
  en: () => import('./locales/en'),
  fr: () => import('./locales/fr'),
  pt: () => import('./locales/pt'),
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<{ language: Language; t: Translate }>({
    language: 'es',
    t: spanish,
  })
  const request = useRef(0)
  const changeLanguage = useCallback(async (language: Language) => {
    const version = ++request.current
    try {
      localStorage.setItem(storageKey, language)
    } catch {
      // The preference still applies for this visit.
    }
    const t = language === 'es' ? spanish : translator((await catalogs[language]()).default)
    if (version !== request.current) return
    setActive({ language, t })
  }, [])
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (isLanguage(saved) && saved !== 'es') void changeLanguage(saved).catch(() => {})
    } catch {
      // Spanish is the default, including when storage is unavailable.
    }
  }, [changeLanguage])
  const locale = locales[active.language]
  useLayoutEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  const value = useMemo(
    () => ({ ...active, locale, changeLanguage }),
    [active, locale, changeLanguage],
  )
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
