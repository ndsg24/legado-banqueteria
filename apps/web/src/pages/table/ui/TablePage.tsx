import { readTableIdea } from '../../../shared/config/tableIdea'
import { useSearchParams } from 'react-router'
import { I18nProvider } from 'react-aria-components'
import { useI18n } from '../../../shared/i18n'
import { InteriorPage } from '../../../widgets/site-layout'
import { TableConfigurator } from '../../../widgets/table-designer'

export function TablePage() {
  const { t, locale } = useI18n()

  const [params] = useSearchParams()
  const idea = readTableIdea(params)
  return (
    <InteriorPage
      section="ambientacion"
      className="table-page"
      topHref="#disena"
      backHref={idea ? '/?portada=' + idea + '#inicio' : '/carta.html'}
      backLabel={t(idea ? 'quote.idea.backPhoto' : 'common.nav.backCatalog')}
      current={t('common.nav.yourTable')}
    >
      <I18nProvider locale={locale}>
        <TableConfigurator key={idea ?? 'custom'} idea={idea} />
      </I18nProvider>
    </InteriorPage>
  )
}
