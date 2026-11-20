import { Link } from 'react-router'
import { useI18n } from '../../../shared/i18n'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'

export function CatalogStudioInvite() {
  const { t } = useI18n()
  const photo = import.meta.env.BASE_URL + 'images/hero-place-settings/dorada-'
  return (
    <Link
      className="catalog__studio-invite"
      to="/ambientacion.html"
      aria-label={t('catalog.intro.designTable')}
    >
      <picture>
        <source
          type="image/avif"
          srcSet={photo + '480.avif 480w, ' + photo + '800.avif 800w'}
          sizes="(max-width: 600px) 100vw, 30vw"
        />
        <img src={photo + '800.webp'} loading="lazy" decoding="async" alt="" />
      </picture>
      <div className="catalog__studio-copy">
        <h2>
          {t('catalog.intro.studioTitle')}
          <br />
          <em>{t('catalog.intro.studioAccent')}</em>
        </h2>
        <span className="catalog__studio-swatches" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="catalog__studio-link">
          {t('catalog.intro.designTable')} <EditorialArrow direction="up-right" />
        </span>
      </div>
    </Link>
  )
}
