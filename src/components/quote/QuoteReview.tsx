import { useImperativeHandle, useRef, type Ref } from 'react'
import type { QuoteRequest } from '../../quote/request'
import { contactDetails, eventDetails, menuGroups, tableDetails } from '../../quote/review'
import type { TableDesign } from '../../types/table'
import { useTableScene } from '../../hooks/useTableScene'
import { SeatingPlan } from '../table/SeatingPlan'
import { capturePlan } from '../../rendering/table/capturePlan'
import { CatalogItemPhoto } from '../catalog/CatalogItemPhoto'

export type TablePicture = { capture: () => string | undefined | Promise<string> }

function ReviewTable({ design, picture }: { design: TableDesign; picture: Ref<TablePicture> }) {
  const { canvasRef, status, capturePreview } = useTableScene(design)
  useImperativeHandle(picture, () => ({ capture: capturePreview }), [capturePreview])
  return <div className="quote-mount__scene">
    <canvas ref={canvasRef} aria-label={'Vista de la mesa de ' + (design.roundSeats?.[0] ?? design.chairs) + ' puestos'} />
    {status !== 'ready' && <span role="status">{status === 'error' ? 'El diseño se detalla en la ficha de ambientación.' : 'Preparando tu mesa…'}</span>}
  </div>
}

function ReviewPlan({ design, picture }: { design: TableDesign; picture: Ref<TablePicture> }) {
  const plan = useRef<SVGSVGElement>(null)
  useImperativeHandle(picture, () => ({ capture: () => plan.current ? capturePlan(plan.current, 1200) : undefined }), [])
  return <SeatingPlan design={design} planRef={plan} />
}

function Details({ rows }: { rows: string[][] }) {
  return <dl className="quote-facts">{rows.map(([label, value]) =>
    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
}

export function QuoteReview({ quote, picture }: { quote: QuoteRequest; picture: Ref<TablePicture> }) {
  const groups = menuGroups(quote.items, quote.sauces)
  return <div className="quote-review">
    <section><h3>El evento</h3><Details rows={eventDetails(quote)} /></section>
    <section><h3>Contacto</h3><Details rows={contactDetails(quote)} /></section>
    <section><h3>Platos y bebestibles</h3>
      {groups.length === 0 && <p>Menú por definir con el equipo.</p>}
      {groups.map(group => <div key={group.name} className="quote-review__group"><h4>{group.name}</h4>
        <ul>{group.entries.map(({ item, name, quantity }) => <li key={item.id}>
          <span className="quote-summary__photo"><CatalogItemPhoto item={item} alt="" sizes="44px" /></span>
          <span>{name}</span><strong>{quantity}</strong>
        </li>)}</ul></div>)}
    </section>
    <section><h3>Ambientación</h3>{quote.table
      ? <>{quote.table.roundTables !== 1 || quote.table.headSeats > 0 ? <ReviewPlan design={quote.table} picture={picture} /> : <ReviewTable design={quote.table} picture={picture} />}<Details rows={tableDetails(quote.table)} /></>
      : <p>Mesa por definir con el equipo.</p>}</section>
    {quote.notes && <section className="quote-review__notes"><h3>Detalles del evento</h3><p>{quote.notes}</p></section>}
  </div>
}
