import type { CatalogItem } from '../../types/catalog'
import { CatalogDishStage } from './CatalogDishStage'

const currency = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

type CatalogCardProps = {
  item: CatalogItem
  selected: boolean
  onToggle: (id: string) => void
  index: number
}

export function CatalogCard({ item, selected, onToggle, index }: CatalogCardProps) {
  return (
    <article className={`catalog-card${selected ? ' is-selected' : ''}`}>
      <div className="catalog-card__skeleton" aria-hidden="true">
        <span className="catalog-skeleton__image" />
        <div className="catalog-skeleton__heading"><span /><span /></div>
        <span className="catalog-skeleton__description" />
      </div>
      <CatalogDishStage item={item} index={index} selected={selected} onToggle={onToggle} />
      <div className="catalog-card__heading" data-catalog-copy>
        <h3>{item.name}</h3>
        {item.price !== undefined && (
          <span>{currency.format(item.price)}<small> / unidad</small></span>
        )}
      </div>
      <p data-catalog-copy>{item.description}</p>
    </article>
  )
}
