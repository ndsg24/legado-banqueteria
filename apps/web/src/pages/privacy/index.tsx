import { useI18n } from '../../shared/i18n'
import { InteriorPage, type InteriorAppearance } from '../../widgets/site-layout'
import './privacy.css'

export function PrivacyPage({ appearance }: { appearance?: InteriorAppearance } = {}) {
  const { t } = useI18n()
  return (
    <InteriorPage
      appearance={appearance}
      section="privacidad"
      topHref="#privacidad"
      mainId="privacidad"
      backHref="/"
      backLabel={t('common.nav.backHome')}
      current={t('common.privacy.title')}
    >
      <article className="privacy-notice">
        <h1>{t('common.privacy.title')}</h1>
        <p>{t('common.privacy.version')}</p>
        <h2>{t('common.privacy.purposeTitle')}</h2>
        <p>{t('common.privacy.purpose')}</p>
        <h2>{t('common.privacy.storageTitle')}</h2>
        <p>{t('common.privacy.storage')}</p>
        <h2>{t('common.privacy.rightsTitle')}</h2>
        <p>{t('common.privacy.rights')}</p>
      </article>
    </InteriorPage>
  )
}
