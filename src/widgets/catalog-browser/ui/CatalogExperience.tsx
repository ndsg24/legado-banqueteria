import { useI18n } from '../../../shared/i18n'
import { Link } from 'react-router'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'
import { useRef } from 'react'
import { useCatalogIntro } from '../model/useCatalogIntro'
import { useCatalog } from '../model/useCatalog'
import { CatalogProductGrid } from './CatalogProductGrid'
import { CatalogCategoryPicker } from './CatalogCategoryPicker'
import { CategoryMotif } from '../../../entities/menu/ui'

export function CatalogExperience() {
  const { t } = useI18n()

  const catalog = useCatalog()
  const headerRef = useRef<HTMLElement>(null)
  useCatalogIntro(headerRef)

  return (
    <section className="catalog" id="carta" aria-labelledby="catalog-title">
      <header className="catalog__header" ref={headerRef}>
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
            <p data-intro-copy>{t('catalog.intro.description')}</p>
          </div>
          <Link className="catalog__studio-invite" to="/ambientacion.html">
            <span>
              {t('catalog.intro.studioOverline')}{' '}
              <i aria-hidden="true">
                <EditorialArrow direction="up-right" />
              </i>
            </span>
            <strong>
              {t('catalog.intro.studioTitle')}
              <br />
              <em>{t('catalog.intro.studioAccent')}</em>
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
        className="catalog__collections"
        role="group"
        aria-label={t('catalog.collections.choose')}
      >
        <button
          type="button"
          aria-pressed={catalog.collection === 'cocktail'}
          onClick={() => catalog.changeCollection('cocktail')}
        >
          <small>
            <CategoryMotif categoryId="extras" />
            {t('catalog.collections.cocktailOverline')}
          </small>
          <span>
            {t('catalog.collections.cocktail')} <em>{t('catalog.collections.cocktailAccent')}</em>
          </span>
          <i aria-hidden="true">
            <EditorialArrow direction="up-right" />
          </i>
        </button>
        <button
          type="button"
          aria-pressed={catalog.collection === 'banquet'}
          onClick={() => catalog.changeCollection('banquet')}
        >
          <small>
            <CategoryMotif categoryId="principales" />
            {t('catalog.collections.menuOverline')}
          </small>
          <span>
            {t('catalog.collections.menu')} <em>{t('catalog.collections.menuAccent')}</em>
          </span>
          <i aria-hidden="true">
            <EditorialArrow direction="up-right" />
          </i>
        </button>
        <button
          type="button"
          aria-pressed={catalog.collection === 'drinks'}
          onClick={() => catalog.changeCollection('drinks')}
        >
          <small>
            <CategoryMotif categoryId="aperitivos" />
            {t('catalog.collections.drinksOverline')}
          </small>
          <span>
            {t('catalog.collections.drinks')} <em>{t('catalog.collections.drinksAccent')}</em>
          </span>
          <i aria-hidden="true">
            <EditorialArrow direction="up-right" />
          </i>
        </button>
      </div>

      <div className="catalog__explorer">
        <CatalogCategoryPicker
          categories={catalog.categories}
          activeId={catalog.activeCategory.id}
          onSelect={catalog.setCategoryId}
        />
        <div
          id="catalog-dishes"
          className="catalog__dishes"
          aria-labelledby="catalog-category-title"
        >
          <div className="catalog__category-heading">
            <h2 id="catalog-category-title">
              {t(catalog.activeCategory.label)}
              <em>.</em>
            </h2>
            <p className="catalog__note">{t('catalog.explorer.disclaimer')}</p>
          </div>
          <CatalogProductGrid items={catalog.activeCategory.items} />
        </div>
      </div>
    </section>
  )
}
