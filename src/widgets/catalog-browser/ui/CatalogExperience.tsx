import { useRef } from 'react'
import { useI18n } from '../../../shared/i18n'
import { CategoryMotif } from '../../../entities/menu/ui'
import { catalogCollections, useCatalog } from '../model/useCatalog'
import { CatalogProductGrid } from './CatalogProductGrid'
import { CatalogCategoryPicker } from './CatalogCategoryPicker'
import { useCatalogLayout } from '../model/useCatalogLayout'
import { CatalogDesktopHeader } from './CatalogDesktopHeader'
import { CatalogStudioInvite } from './CatalogStudioInvite'

export function CatalogExperience() {
  const { t } = useI18n()
  const catalog = useCatalog()
  const layout = useCatalogLayout()
  const desktop = layout === 'desktop'
  const explorerRef = useRef<HTMLDivElement>(null)
  const count = catalog.visibleCategories.reduce(
    (total, category) => total + category.items.length,
    0,
  )
  const drinks = catalog.collection === 'drinks'

  function chooseCategory(id: string | null) {
    if (id === (catalog.activeCategory?.id ?? null)) return
    const explorer = explorerRef.current
    if (
      !desktop &&
      explorer &&
      explorer.getBoundingClientRect().top < parseFloat(getComputedStyle(explorer).scrollMarginTop)
    ) {
      explorer.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
    catalog.setCategoryId(id)
  }

  return (
    <section
      className={desktop ? 'catalog catalog--desktop' : 'catalog'}
      id="carta"
      aria-labelledby="catalog-title"
    >
      {desktop ? (
        <CatalogDesktopHeader collection={catalog.collection} onChoose={catalog.changeCollection} />
      ) : (
        <header className="catalog__header">
          <div>
            <h1 id="catalog-title">
              {t('common.nav.catalog')}
              <em>.</em>
            </h1>
            {catalog.isOverview && <p>{t('catalog.intro.description')}</p>}
          </div>
          <div
            className="catalog__collections"
            role="group"
            aria-label={t('catalog.collections.choose')}
          >
            {catalogCollections.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={catalog.collection === option.id}
                onClick={() => catalog.changeCollection(option)}
              >
                <CategoryMotif categoryId={option.motif} />
                {t(option.label)}
              </button>
            ))}
          </div>
        </header>
      )}

      <div className="catalog__explorer" ref={explorerRef}>
        <div className="catalog__toolbar">
          <h2
            id="catalog-category-title"
            className={desktop ? 'catalog__desktop-title' : 'catalog__accessible-title'}
          >
            {t(catalog.title)}
            <em>.</em>
          </h2>
          <CatalogCategoryPicker
            compact={layout === 'compact'}
            categories={catalog.categories}
            activeId={catalog.activeCategory?.id}
            onSelect={chooseCategory}
          />
          {!desktop && (
            <span className="catalog__count" role="status">
              {t(drinks ? 'catalog.explorer.drinksCount' : 'catalog.explorer.dishCount', { count })}
            </span>
          )}
        </div>
        <section id="catalog-dishes" aria-labelledby="catalog-category-title">
          <CatalogProductGrid
            categories={catalog.visibleCategories}
            showCategory={desktop || !catalog.activeCategory}
          />
        </section>
      </div>
      <div className="catalog__note">
        <p>{t('catalog.explorer.presentation')}</p>
        <p>{t('catalog.explorer.dietary')}</p>
      </div>
      {!desktop && <CatalogStudioInvite />}
    </section>
  )
}
