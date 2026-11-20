import { useRef } from 'react'
import { Link } from 'react-router'
import { useI18n } from '../../../shared/i18n'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'
import { CategoryMotif } from '../../../entities/menu/ui'
import { useCatalogIntro } from '../model/useCatalogIntro'
import { catalogCollections } from '../model/useCatalog'

type Collection = (typeof catalogCollections)[number]
type Props = { collection: Collection['id']; onChoose: (option: Collection) => void }

export function CatalogDesktopHeader({ collection, onChoose }: Props) {
  const { t } = useI18n()
  const headerRef = useRef<HTMLElement>(null)
  useCatalogIntro(headerRef)
  return (
    <>
      <header className="catalog-editorial" ref={headerRef}>
        <div className="catalog__eyebrow" data-intro-meta>
          <span>{t('catalog.intro.eyebrow')}</span>
          <span>{t('catalog.intro.overline')}</span>
        </div>
        <div className="catalog__introduction">
          <div>
            <h1 id="catalog-title">
              <span className="catalog__title-line">
                <span data-title-line>{t('catalog.intro.titleLead')}</span>
              </span>
              <span className="catalog__title-line">
                <span data-title-line>
                  <em>{t('catalog.intro.titleAccent')}</em>
                </span>
              </span>
            </h1>
            <p data-intro-copy>{t('catalog.desktop.description')}</p>
          </div>
          <Link
            aria-label={t('catalog.intro.designTable')}
            className="catalog-editorial__studio"
            to="/ambientacion.html"
          >
            <span>
              {t('catalog.intro.studioOverline')}{' '}
              <i aria-hidden="true">
                <EditorialArrow direction="up-right" />
              </i>
            </span>
            <strong>
              {t('catalog.desktop.studioTitle')}
              <br />
              <em>{t('catalog.desktop.studioAccent')}</em>
            </strong>
            <small>{t('catalog.intro.studioDescription')}</small>
            <span className="catalog__studio-swatches" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <b>
              {t('catalog.intro.designTable')} <EditorialArrow direction="up-right" />
            </b>
          </Link>
        </div>
      </header>

      <div
        className="catalog-editorial__collections"
        role="group"
        aria-label={t('catalog.collections.choose')}
      >
        {catalogCollections.map((option) => (
          <button
            type="button"
            key={option.id}
            aria-pressed={collection === option.id}
            onClick={() => onChoose(option)}
          >
            <small>
              <CategoryMotif categoryId={option.motif} />
              {t(`${option.label}Overline`)}
            </small>
            <span>
              {t(option.label)} <em>{t(`${option.label}Accent`)}</em>
            </span>
            <i aria-hidden="true">
              <EditorialArrow direction="up-right" />
            </i>
          </button>
        ))}
      </div>
    </>
  )
}
