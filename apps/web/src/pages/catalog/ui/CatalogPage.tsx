import { useI18n } from '../../../shared/i18n'
import { CatalogExperience } from '../../../widgets/catalog-browser'
import { InteriorPage } from '../../../widgets/site-layout'
import './catalog.css'

export function CatalogPage() {
  const { t } = useI18n()

  return (
    <InteriorPage
      section="carta"
      className="catalog-page"
      topHref="#carta"
      backHref="/#inicio"
      backLabel={t('common.nav.backHome')}
      current={t('common.nav.catalog')}
    >
      <CatalogExperience />
    </InteriorPage>
  )
}
