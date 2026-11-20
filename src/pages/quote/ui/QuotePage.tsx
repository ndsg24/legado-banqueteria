import { I18nProvider } from 'react-aria-components'
import { useI18n } from '../../../shared/i18n'
import { InteriorPage } from '../../../widgets/site-layout'
import { lazy } from 'react'
import { QuoteForm } from '../../../widgets/quote-wizard'
import './quote.css'

const TableEditor = lazy(() =>
  import('../../../widgets/table-designer').then((m) => ({ default: m.TableEditor })),
)

export function QuotePage() {
  const { t, locale } = useI18n()

  return (
    <InteriorPage
      section="cotizar"
      mainId="cotizar"
      mainClassName="quote-page"
      topHref="#cotizar"
      backHref="/#contacto"
      backLabel={t('quote.intro.back')}
      current={t('quote.intro.breadcrumb')}
    >
      <div className="quote-layout">
        <header className="quote-intro">
          <h1>
            {t('quote.intro.title')} <em>{t('quote.intro.accent')}</em>
          </h1>
          <p>{t('quote.intro.description')}</p>
        </header>
        <I18nProvider locale={locale}>
          <QuoteForm TableEditor={TableEditor} />
        </I18nProvider>
      </div>
    </InteriorPage>
  )
}
