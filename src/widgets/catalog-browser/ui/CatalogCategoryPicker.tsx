import { useI18n } from '../../../shared/i18n'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'
import type { CatalogCategory } from '../../../entities/menu'
import { useCategoryNavigation } from '../model/useCategoryNavigation'
import { useCategoryMotion } from '../model/useCategoryMotion'
import { CategoryMotif } from '../../../entities/menu/ui'

type CatalogCategoryPickerProps = {
  categories: readonly CatalogCategory[]
  activeId: string
  onSelect: (id: string) => void
}

export function CatalogCategoryPicker({
  categories,
  activeId,
  onSelect,
}: CatalogCategoryPickerProps) {
  const { t } = useI18n()

  const { listRef, activeIndex, selectAdjacent, selectCategory } = useCategoryNavigation(
    categories,
    activeId,
    onSelect,
  )

  useCategoryMotion(listRef, activeId)

  return (
    <nav className="tasting-menu" aria-label={t('catalog.explorer.categories')}>
      <div className="tasting-menu__caption">
        <span>{t('catalog.explorer.title')}</span>
        <span aria-hidden="true">
          {t('catalog.explorer.description')} <EditorialArrow direction="both" />
        </span>
      </div>
      <div
        ref={listRef}
        className={`tasting-menu__course-list${categories.length > 5 ? ' tasting-menu__course-list--full' : ''}`}
      >
        {categories.map((category, index) => (
          <button
            className="tasting-menu__course"
            key={category.id}
            type="button"
            aria-pressed={category.id === activeId}
            aria-controls="catalog-dishes"
            onClick={() => selectCategory(category.id)}
          >
            <svg
              className="tasting-menu__outline"
              viewBox="0 0 140 190"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <ellipse cx="70" cy="95" rx="58" ry="88" pathLength="1" />
            </svg>
            <span className="tasting-menu__number">{String(index + 1).padStart(2, '0')}</span>
            <span className="tasting-menu__illustration">
              <CategoryMotif categoryId={category.id} />
            </span>
            <span className="tasting-menu__name">{t(category.label)}</span>
            <small>
              {category.items.length} {t('catalog.explorer.flavors')}
            </small>
          </button>
        ))}
      </div>
      <div className="tasting-menu__navigation">
        <p>
          {t('catalog.explorer.swipe')}{' '}
          <span aria-hidden="true">
            <EditorialArrow direction="both" />
          </span>
        </p>
        <div>
          <button
            type="button"
            aria-label={t('catalog.explorer.previous')}
            disabled={activeIndex <= 0}
            onClick={() => selectAdjacent(-1)}
          >
            <EditorialArrow direction="left" />
          </button>
          <output aria-live="polite" aria-label={t('catalog.explorer.current')}>
            {String(activeIndex + 1).padStart(2, '0')}
            <span> / {String(categories.length).padStart(2, '0')}</span>
          </output>
          <button
            type="button"
            aria-label={t('catalog.explorer.next')}
            disabled={activeIndex >= categories.length - 1}
            onClick={() => selectAdjacent(1)}
          >
            <EditorialArrow direction="right" />
          </button>
        </div>
      </div>
    </nav>
  )
}
