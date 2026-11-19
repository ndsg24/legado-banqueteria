import { useI18n } from '../../../shared/i18n'
import { CatalogExperience } from '../../../widgets/catalog-browser'
import { Footer, PagePath, Header } from '../../../widgets/site-layout'
import { useTheme } from '../../../shared/theme'
import './catalog.css'

export function CatalogPage() {
  const { t } = useI18n()

  const { theme, toggleTheme } = useTheme()
  const homeHref = '/#inicio'

  return (
    <div className="site-shell catalog-page site-texture">
      <Header activeSection="carta" theme={theme} onThemeToggle={toggleTheme} />
      <main>
        <PagePath
          href={homeHref}
          backLabel={t('common.nav.backHome')}
          current={t('common.nav.catalog')}
        />
        <CatalogExperience />
      </main>
      <Footer homeHref={homeHref} topHref="#carta" />
    </div>
  )
}
