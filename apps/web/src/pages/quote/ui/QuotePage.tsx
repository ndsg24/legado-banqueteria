import { I18nProvider } from 'react-aria-components'
import { useI18n } from '../../../shared/i18n'
import { InteriorPage } from '../../../widgets/site-layout'
import { isIdeasPreview, readTableIdea } from '../../../shared/config/tableIdea'
import { lazy } from 'react'
import { useLocation } from 'react-router'
import { QuoteForm } from '../../../widgets/quote-wizard'
import './quote.css'

const TableEditor = lazy(() =>
  import('../../../widgets/table-designer').then((m) => ({ default: m.TableEditor })),
)

export function QuotePage() {
  const { t, locale } = useI18n()

  const { search } = useLocation()
  const idea = readTableIdea(new URLSearchParams(search))

  return (
    <InteriorPage
      section="cotizar"
      mainId="cotizar"
      mainClassName="quote-page"
      topHref="#cotizar"
      backHref={idea ? '/ambientacion.html' + search : '/#contacto'}
      backLabel={t(idea ? 'quote.idea.backIdea' : 'quote.intro.back')}
      current={t('quote.intro.breadcrumb')}
    >
      <div className="quote-layout">
        <header className="quote-intro">
          <h1>
            {t('quote.intro.title')} <em>{t('quote.intro.accent')}</em>
          </h1>
          <p>
            {idea
              ? t('quote.idea.loaded', {
                  name: t(`home.hero.${idea}.title`) + ' ' + t(`home.hero.${idea}.titleAccent`),
                })
              : t('quote.intro.description')}
          </p>
          {isIdeasPreview && <p>{t('quote.idea.trial')}</p>}
        </header>
        <I18nProvider locale={locale}>
          <QuoteForm key={idea ?? 'custom'} idea={idea} TableEditor={TableEditor} />
        </I18nProvider>
      </div>
    </InteriorPage>
  )
}
