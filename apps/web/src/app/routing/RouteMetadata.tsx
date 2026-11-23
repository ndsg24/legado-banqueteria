import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import { isMessageKey, useI18n } from '../../shared/i18n'
import metadata from './metadata'

const socialLocales = { es: 'es_CL', en: 'en_US', fr: 'fr_FR', pt: 'pt_BR' }

export function RouteMetadata() {
  const { pathname } = useLocation()
  const { t, language, locale } = useI18n()
  useLayoutEffect(() => {
    const page = metadata[pathname as keyof typeof metadata] ?? metadata['/']
    document.title = t(page.title)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', page.canonical)
    for (const tag of document.querySelectorAll<HTMLMetaElement>('meta[data-route-meta]')) {
      const key = tag.dataset.routeMeta as 'title' | 'description' | 'canonical'
      tag.content = key === 'canonical' ? page.canonical : t(page[key])
    }
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute('content', socialLocales[language])
    for (const tag of document.querySelectorAll<HTMLMetaElement>(
      'meta[property="og:image:alt"], meta[name="twitter:image:alt"]',
    ))
      tag.content = t('common.brand.logoAlt')
    const schema = document.getElementById('route-schema')
    if (schema)
      schema.textContent = JSON.stringify(page.schema, (key, value: unknown) => {
        if (key === 'inLanguage') return locale
        return isMessageKey(value) ? t(value) : value
      })
  }, [pathname, locale, language, t])
  return null
}
