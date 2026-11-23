import { useLayoutEffect, type ReactNode } from 'react'
import { I18nProvider } from 'react-aria-components'
import { MemoryRouter } from 'react-router'
import { LanguageProvider, useI18n } from '@legado/brand/i18n'
function Locale({ children }: { children: ReactNode }) {
  const { locale } = useI18n()
  return <I18nProvider locale={locale}>{children}</I18nProvider>
}

export function PreviewFrame({
  children,
  theme,
  isAdmin,
}: {
  children: ReactNode
  theme: string
  isAdmin: boolean
}) {
  useLayoutEffect(() => {
    if (!isAdmin) return
    const root = document.documentElement
    root.dataset.interface = 'admin'
    return () => {
      delete root.dataset.interface
    }
  }, [isAdmin])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <MemoryRouter initialEntries={['/' + window.location.search]}>
      <LanguageProvider storageKey="legado-design-system-language">
        <Locale>
          <div className="ds-preview" lang="es-CL">
            {children}
          </div>
        </Locale>
      </LanguageProvider>
    </MemoryRouter>
  )
}
