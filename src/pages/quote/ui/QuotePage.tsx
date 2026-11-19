import { I18nProvider } from 'react-aria-components'
import { useI18n } from '../../../shared/i18n'
import { Header, Footer, PagePath } from '../../../widgets/site-layout'
import { QuoteForm } from '../../../widgets/quote-wizard'
import { useTheme } from '../../../shared/theme'
import './quote.css'

export function QuotePage() {
  const { t, locale } = useI18n()

  const { theme, toggleTheme } = useTheme()
  const home = '/'
  return (
    <div className="site-shell site-texture">
      <Header activeSection="cotizar" theme={theme} onThemeToggle={toggleTheme} />
      <main id="cotizar" className="quote-page">
        <PagePath
          href={home + '#contacto'}
          backLabel={t('quote.intro.back')}
          current={t('quote.intro.breadcrumb')}
        />
        <div className="quote-layout">
          <header className="quote-intro">
            <h1>
              {t('quote.intro.title')} <em>{t('quote.intro.accent')}</em>
            </h1>
            <p>{t('quote.intro.description')}</p>
          </header>
          <I18nProvider locale={locale}>
            <QuoteForm />
          </I18nProvider>
        </div>
      </main>
      <Footer homeHref={home + '#inicio'} topHref="#cotizar" />
    </div>
  )
}
