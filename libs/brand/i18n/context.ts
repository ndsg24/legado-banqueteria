import { createContext, useContext } from 'react'
import { type Language, type Translate } from '@legado/domain/i18n/messages'

export const LanguageContext = createContext<{
  language: Language
  locale: string
  t: Translate
  changeLanguage: (language: Language) => Promise<void>
} | null>(null)

export function useI18n() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('Missing LanguageProvider')
  return context
}
