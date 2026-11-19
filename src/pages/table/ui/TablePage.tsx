import { I18nProvider } from 'react-aria-components'
import { useI18n } from '../../../shared/i18n'
import { PagePath, Header, Footer } from '../../../widgets/site-layout'
import { TableConfigurator } from '../../../widgets/table-designer'
import { useTheme } from '../../../shared/theme'
import './table.css'

export function TablePage() {
  const { t, locale } = useI18n()

  const { theme, toggleTheme } = useTheme()
  const homeHref = '/#inicio'
  return (
    <div className="site-shell site-texture table-page">
      <Header activeSection="ambientacion" theme={theme} onThemeToggle={toggleTheme} />
      <main>
        <PagePath
          href="/carta.html"
          backLabel={t('common.nav.backCatalog')}
          current={t('common.nav.yourTable')}
        />
        <I18nProvider locale={locale}>
          <TableConfigurator />
        </I18nProvider>
      </main>
      <Footer homeHref={homeHref} topHref="#disena" />
    </div>
  )
}
