import { siteConfig } from '../../config/site'
import type { CatalogItem } from '../../types/catalog'
import { EditorialArrow } from '../ui/EditorialArrow'

type CatalogSelectionProps = { items: readonly CatalogItem[]; onRemove: (id: string) => void; onClear: () => void }

export function CatalogSelection({ items, onRemove, onClear }: CatalogSelectionProps) {
  const message = `Hola Legado, me gustaría cotizar una celebración.\n\nMi selección de la carta:\n${items.map((item) => `• ${item.name}`).join('\n')}\n\nFecha del evento:\nCantidad de invitados:\nLugar:\n\nQuedo atento/a para definir cantidades, disponibilidad y presupuesto.`
  return (
    <aside className="catalog-selection" aria-label="Mi selección de la carta">
      <div className="catalog-selection__intro"><span>Tu celebración, a tu manera</span><h3>Una mesa <em>por imaginar.</em></h3><p>Marca con + lo que te inspire. Reuniremos tus favoritos en una consulta para preparar tu propuesta.</p></div>
      <div className="catalog-selection__body">
        <p role="status" aria-live="polite">{items.length ? `${items.length} ${items.length === 1 ? 'opción seleccionada' : 'opciones seleccionadas'}` : 'Tu selección comienza con un bocado.'}</p>
        {items.length > 0 && <><ul>{items.map((item) => <li key={item.id}><span>{item.name}</span><button type="button" onClick={() => onRemove(item.id)} aria-label={`Quitar ${item.name}`}>×</button></li>)}</ul><div className="catalog-selection__actions"><a className="button--gold" href={`mailto:${siteConfig.email}?subject=${encodeURIComponent('Mi selección · Legado')}&body=${encodeURIComponent(message)}`}>Consultar mi selección <EditorialArrow direction="up-right" /></a><button type="button" onClick={onClear}>Limpiar selección</button></div></>}
        <small>La selección es una referencia para cotizar. Cantidades, disponibilidad y valor final se confirman con nuestro equipo.</small>
      </div>
    </aside>
  )
}
