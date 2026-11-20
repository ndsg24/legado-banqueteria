import { useI18n } from '../../../shared/i18n'
import type { CatalogCategory, CatalogItem } from '../../../entities/menu'
import { DishDetailsLabel, DishWatermark } from '../../../entities/menu/ui'
import { CatalogDishStage } from './CatalogDishStage'

type Props = {
  item: CatalogItem
  category: CatalogCategory
  showCategory: boolean
  onOpen: () => void
}

export function CatalogCard({ item, category, showCategory, onOpen }: Props) {
  const { t } = useI18n()
  const name = t(item.name)
  return (
    <article className="catalog-card" data-category={category.id}>
      <DishWatermark categoryId={category.id} itemId={item.id} />
      {showCategory && <span className="quote-dish__tag">{t(category.label)}</span>}
      <CatalogDishStage item={item} />
      <div className="catalog-card__copy">
        <h3 data-catalog-copy>{name}</h3>
        <p data-catalog-copy id={'catalog-description-' + item.id}>
          {t(item.description)}
        </p>
        <button
          type="button"
          className="catalog-card__details"
          aria-label={t('quote.selection.details', { name })}
          aria-describedby={'catalog-description-' + item.id}
          aria-haspopup="dialog"
          onClick={onOpen}
        >
          <DishDetailsLabel />
        </button>
      </div>
    </article>
  )
}
