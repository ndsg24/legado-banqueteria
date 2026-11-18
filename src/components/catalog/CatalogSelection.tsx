import { quoteHref } from '../../quote/selection'
import type { CatalogItem } from '../../types/catalog'
import { EditorialArrow } from '../ui/EditorialArrow'

import { QuantityControl } from '../ui/QuantityControl'
import { isSingleChoice, writeSelectionParams, type Quantities } from '../../quote/quantities'

type CatalogSelectionProps = { items: readonly CatalogItem[]; quantities: Quantities; onQuantityChange: (id: string, quantity: number) => void; onClear: () => void }

export function CatalogSelection({ items, quantities, onQuantityChange, onClear }: CatalogSelectionProps) {
  const params = new URLSearchParams()
  writeSelectionParams(params, quantities)
  return (
    <aside className="catalog-selection" aria-label="Mi selección de la carta">
      <div className="catalog-selection__intro"><span>Tu celebración, a tu manera</span><h3>Una mesa <em>por imaginar.</em></h3><p>Marca con + lo que te inspire. Reuniremos tus favoritos en una consulta para preparar tu propuesta.</p></div>
      <div className="catalog-selection__body">
        <p role="status" aria-live="polite">{items.length ? `${items.length} ${items.length === 1 ? 'opción seleccionada' : 'opciones seleccionadas'}` : 'Tu selección comienza con un bocado.'}</p>
        {items.length > 0 && <><ul>{items.map(item => <li key={item.id}>
          <span>{item.name}</span>
          {isSingleChoice(item.id)
            ? <button type="button" className="catalog-selection__remove" aria-label={'Quitar ' + item.name} onClick={() => onQuantityChange(item.id, 0)}>Quitar</button>
            : <QuantityControl name={item.name} quantity={quantities[item.id]} onChange={quantity => onQuantityChange(item.id, quantity)} />}
        </li>)}</ul><div className="catalog-selection__actions"><a className="button--gold" href={quoteHref(params)}>Consultar mi selección <EditorialArrow direction="up-right" /></a><button type="button" onClick={onClear}>Limpiar selección</button></div></>}
        <small>La selección es una referencia para cotizar. Cantidades, disponibilidad y valor final se confirman con nuestro equipo.</small>
      </div>
    </aside>
  )
}
