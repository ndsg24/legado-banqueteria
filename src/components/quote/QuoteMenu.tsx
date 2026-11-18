import { useState } from 'react'
import { quoteCategories } from '../../config/catalog'
import { isSingleChoice, type Quantities } from '../../quote/quantities'
import { selectedSauce } from '../../quote/sauces'
import { CatalogItemPhoto } from '../catalog/CatalogItemPhoto'
import { CategoryMotif } from '../catalog/CategoryMotif'
import { QuantityControl } from '../ui/QuantityControl'
import { QuoteSelection } from './QuoteSelection'
import { MainSaucePicker, type SaucePickerProps } from './MainSaucePicker'

const collections = [
  { id: 'cocktail', label: 'Cóctel', motif: 'salados' },
  { id: 'banquet', label: 'Menú', motif: 'principales' },
  { id: 'drinks', label: 'Bebestibles', motif: 'aperitivos' },
] as const

type Props = SaucePickerProps & {
  selected: Quantities
  onQuantityChange: (id: string, quantity: number) => void
}

export function QuoteMenu({ selected, onQuantityChange, ...saucePicker }: Props) {
  const [categoryId, setCategoryId] = useState(quoteCategories[0].id)
  const category = quoteCategories.find((option) => option.id === categoryId) ?? quoteCategories[0]
  const siblings = quoteCategories.filter((option) => option.collection === category.collection)
  const hasSelection = category.items.some((item) => selected[item.id] > 0)

  return (
    <div className="quote-menu">
      <div className="quote-menu__families" role="group" aria-label="Explorar la carta">
        {collections.map((family) => (
          <button
            key={family.id}
            type="button"
            aria-pressed={family.id === category.collection}
            onClick={() => {
              if (family.id !== category.collection)
                setCategoryId(quoteCategories.find((option) => option.collection === family.id)!.id)
            }}
          >
            <CategoryMotif categoryId={family.motif} />
            {family.label}
          </button>
        ))}
        <QuoteSelection selected={selected} onQuantityChange={onQuantityChange} {...saucePicker} />
      </div>
      <div className="quote-menu__categories" role="group" aria-label="Categoría">
        {siblings.map((option) => (
          <button
            type="button"
            key={option.id}
            aria-pressed={option.id === categoryId}
            onClick={() => setCategoryId(option.id)}
          >
            <CategoryMotif categoryId={option.id} />
            <span>{option.label}</span>
          </button>
        ))}
      </div>
      <div className="quote-menu__grid" data-has-selection={hasSelection}>
        {category.items.map((item) => {
          const single = isSingleChoice(item.id)
          const quantity = selected[item.id] ?? 0
          const sauce = quantity > 0 && selectedSauce(item.id, saucePicker.sauces)
          return (
            <article key={item.id} className="quote-dish" data-selected={quantity > 0}>
              <button
                type="button"
                className="quote-dish__add"
                aria-label={(single ? 'Seleccionar ' : 'Agregar ') + item.name}
                aria-pressed={single ? quantity > 0 : undefined}
                disabled={quantity === Number.MAX_SAFE_INTEGER}
                onClick={() => onQuantityChange(item.id, single && quantity > 0 ? 0 : quantity + 1)}
              >
                <span className="quote-dish__frame">
                  <span className="quote-dish__photo">
                    <CatalogItemPhoto item={item} alt="" sizes="(max-width: 600px) 40vw, 200px" />
                  </span>
                  {sauce && (
                    <span className="quote-dish__sauce-photo">
                      <CatalogItemPhoto item={sauce} alt="" sizes="(max-width: 600px) 10vw, 56px" />
                    </span>
                  )}
                </span>
                <span className="quote-dish__caption">
                  <span>
                    {item.name}
                    {quantity > 0 && <small>En tu selección</small>}
                  </span>
                  {single && (
                    <span className="quote-dish__action" aria-hidden="true">
                      {quantity > 0 ? '−' : '+'}
                    </span>
                  )}
                </span>
              </button>
              {quantity > 0 && category.id === 'principales' && (
                <MainSaucePicker main={item} {...saucePicker} />
              )}
              {!single && (
                <div className="quote-dish__units">
                  <span>Unidades</span>
                  <QuantityControl
                    name={item.name}
                    quantity={quantity}
                    onChange={(next) => onQuantityChange(item.id, next)}
                  />
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
