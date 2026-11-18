import { EditorialArrow } from '../ui/EditorialArrow'
import type { CatalogCategory } from '../../types/catalog'
import { useCategoryNavigation } from '../../hooks/useCategoryNavigation'
import { useCategoryMotion } from '../../hooks/useCategoryMotion'
import { CategoryMotif } from './CategoryMotif'

type CatalogCategoryPickerProps = {
  categories: readonly CatalogCategory[]
  activeId: string
  onSelect: (id: string) => void
}

export function CatalogCategoryPicker({ categories, activeId, onSelect }: CatalogCategoryPickerProps) {
  const { listRef, activeIndex, selectAdjacent, selectCategory } = useCategoryNavigation(categories, activeId, onSelect)

  useCategoryMotion(listRef, activeId)

  return (
    <nav className="tasting-menu" aria-label="Categorías de la carta">
      <div className="tasting-menu__caption">
        <span>Elige el próximo sabor</span>
        <span aria-hidden="true">Un recorrido por nuestra cocina <EditorialArrow direction="both" /></span>
      </div>
      <div ref={listRef} className={`tasting-menu__course-list${categories.length > 5 ? ' tasting-menu__course-list--full' : ''}`}>
        {categories.map((category, index) => (
          <button
            className="tasting-menu__course"
            key={category.id}
            type="button"
            aria-pressed={category.id === activeId}
            aria-controls="catalog-dishes"
            onClick={() => selectCategory(category.id)}
          >
            <svg className="tasting-menu__outline" viewBox="0 0 140 190" preserveAspectRatio="none" aria-hidden="true"><ellipse cx="70" cy="95" rx="58" ry="88" pathLength="1" /></svg>
            <span className="tasting-menu__number">{String(index + 1).padStart(2, '0')}</span>
            <span className="tasting-menu__illustration"><CategoryMotif categoryId={category.id} /></span>
            <span className="tasting-menu__name">{category.label}</span>
            <small>{category.items.length} sabores</small>
          </button>
        ))}
      </div>
      <div className="tasting-menu__navigation">
        <p>Desliza para explorar <span aria-hidden="true"><EditorialArrow direction="both" /></span></p>
        <div>
          <button type="button" aria-label="Categoría anterior" disabled={activeIndex <= 0} onClick={() => selectAdjacent(-1)}><EditorialArrow direction="left" /></button>
          <output aria-live="polite" aria-label="Categoría actual">{String(activeIndex + 1).padStart(2, '0')}<span> / {String(categories.length).padStart(2, '0')}</span></output>
          <button type="button" aria-label="Categoría siguiente" disabled={activeIndex >= categories.length - 1} onClick={() => selectAdjacent(1)}><EditorialArrow direction="right" /></button>
        </div>
      </div>
    </nav>
  )
}
