import { useI18n } from '../../../shared/i18n'
import type { CatalogItem } from '../../../entities/menu'
import { CatalogDishStage } from './CatalogDishStage'

type CatalogCardProps = {
  item: CatalogItem
  index: number
}

export function CatalogCard({ item, index }: CatalogCardProps) {
  const { t } = useI18n()

  return (
    <article className="catalog-card">
      <div className="catalog-card__skeleton" aria-hidden="true">
        <span className="catalog-skeleton__image" />
        <span className="catalog-skeleton__heading" />
        <span className="catalog-skeleton__description" />
      </div>
      <CatalogDishStage item={item} index={index} />
      <div className="catalog-card__heading" data-catalog-copy>
        <h3>{t(item.name)}</h3>
      </div>
      <p data-catalog-copy>{t(item.description)}</p>
    </article>
  )
}
