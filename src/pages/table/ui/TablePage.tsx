import { I18nProvider } from 'react-aria-components'
import { useI18n } from '../../../shared/i18n'
import { InteriorPage } from '../../../widgets/site-layout'
import { TableConfigurator } from '../../../widgets/table-designer'

export function TablePage() {
  const { t, locale } = useI18n()

  return (
    <InteriorPage
      section="ambientacion"
      className="table-page"
      topHref="#disena"
      backHref="/carta.html"
      backLabel={t('common.nav.backCatalog')}
      current={t('common.nav.yourTable')}
    >
      <I18nProvider locale={locale}>
        <TableConfigurator />
      </I18nProvider>
    </InteriorPage>
  )
}
