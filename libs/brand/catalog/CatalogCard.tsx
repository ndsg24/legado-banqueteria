import { useI18n } from '../i18n'
import type { CatalogCategory, CatalogItem } from '@legado/domain/menu/types'
import type { CatalogImageResolver } from './image-source'
import { DishDetailsLabel } from './DishDetailsLabel'
import { DishWatermark } from './DishWatermark'
import '../styles/catalog-card.css'
import { CatalogDishStage } from './CatalogDishStage'

type Props = {
  item: CatalogItem
  category: CatalogCategory
  resolveImage?: CatalogImageResolver
  showCategory: boolean
  onOpen: () => void
}

export function CatalogCard({ item, category, showCategory, onOpen, resolveImage }: Props) {
  const { t } = useI18n()
  const name = t(item.name)
  return (
    <article className="catalog-card" data-category={category.id}>
      <DishWatermark categoryId={category.id} itemId={item.id} />
      {showCategory && <span className="quote-dish__tag">{t(category.label)}</span>}
      <CatalogDishStage item={item} resolveImage={resolveImage} />
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
