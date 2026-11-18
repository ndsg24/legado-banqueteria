import { SeatingPlan } from '../table/SeatingPlan'
import { napkinFoldLabels, totalSeats, dinnerwareStyles, fabricColor, floralDetails, fabricPartLabel } from '../../config/table'
import { tableDesignUrl } from '../../hooks/useTableDesign'
import { useTableScene } from '../../hooks/useTableScene'
import { tableParts } from '../../types/table'
import type { TableDesign } from '../../types/table'
import { EditorialArrow } from '../ui/EditorialArrow'

type Props = { design: TableDesign; included: boolean; onInclude: (include: boolean) => void }

export function QuoteTablePreview({ design, included, onInclude }: Props) {
  const { canvasRef, status } = useTableScene(design)
  const tables = design.roundTables + Number(design.headSeats > 0)
  const editUrl = tableDesignUrl(design, import.meta.env.BASE_URL + 'ambientacion.html')
  return <div className="quote-mount">
    {(design.roundTables !== 1 || design.headSeats > 0) && <SeatingPlan design={design} />}
    <div className="quote-mount__scene" hidden={design.roundTables === 0}>
      <canvas ref={canvasRef} aria-label={`Vista 3D de la mesa de ${design.roundSeats?.[0] ?? design.chairs} puestos. Arrastra para girar.`} />
      {status !== 'ready' && <span role="status">{status === 'loading' ? 'Preparando tu mesa…' : 'La vista 3D no está disponible en este dispositivo.'}</span>}
    </div>
    <div className="quote-mount__caption">
      <span>{totalSeats(design)} puestos · {tables} {tables === 1 ? 'mesa' : 'mesas'}</span>
      <a href={editUrl} target="_blank" rel="noopener noreferrer" aria-label="Diseñar mi mesa en otra pestaña">Diseñar mi mesa <EditorialArrow direction="up-right" /></a>
    </div>
    <p>{dinnerwareStyles[design.dinnerware].label} · {napkinFoldLabels[design.napkinFold]} · {floralDetails(design).map(([, value]) => value).join(' · ')}</p>
    <div className="quote-mount__swatches" aria-label="Telas de la mesa">
      {tableParts.map(part => <span key={part} title={fabricPartLabel(part, design) + ' · ' + fabricColor(design[part]).label}>
        <i style={{ backgroundColor: fabricColor(design[part]).hex }} aria-hidden="true" />
        {fabricPartLabel(part, design)} · {fabricColor(design[part]).label}
      </span>)}
    </div>
    <label className="quote-mount__include"><input type="checkbox" checked={included} onChange={event => onInclude(event.target.checked)} />Incluir esta ambientación en mi cotización</label>
  </div>
}
