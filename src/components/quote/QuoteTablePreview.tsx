import { dinnerwareStyles, fabricColor, floralStyles, tablePartLabels } from '../../config/table'
import { tableDesignUrl } from '../../hooks/useTableDesign'
import { useTableScene } from '../../hooks/useTableScene'
import { tableParts } from '../../types/table'
import type { TableDesign } from '../../types/table'
import { EditorialArrow } from '../ui/EditorialArrow'

type Props = { design: TableDesign; included: boolean; onInclude: (include: boolean) => void }

export function QuoteTablePreview({ design, included, onInclude }: Props) {
  const { canvasRef, status } = useTableScene(design)
  const editUrl = tableDesignUrl(design, import.meta.env.BASE_URL + 'ambientacion.html')
  return <div className="quote-mount">
    <div className="quote-mount__scene">
      <canvas ref={canvasRef} aria-label={`Vista 3D de la mesa de ${design.chairs} puestos. Arrastra para girar.`} />
      {status !== 'ready' && <span role="status">{status === 'loading' ? 'Preparando tu mesa…' : 'La vista 3D no está disponible en este dispositivo.'}</span>}
    </div>
    <div className="quote-mount__caption">
      <span>{design.chairs} puestos</span>
      <a href={editUrl} target="_blank" rel="noopener noreferrer" aria-label="Diseñar mi mesa en otra pestaña">Diseñar mi mesa <EditorialArrow direction="up-right" /></a>
    </div>
    <p>{dinnerwareStyles[design.dinnerware].label} · {floralStyles.find(style => style.id === design.floral)?.label}</p>
    <div className="quote-mount__swatches" aria-label="Telas de la mesa">
      {tableParts.map(part => <span key={part} title={tablePartLabels[part] + ' · ' + fabricColor(design[part]).label}>
        <i style={{ backgroundColor: fabricColor(design[part]).hex }} aria-hidden="true" />
        {tablePartLabels[part]} · {fabricColor(design[part]).label}
      </span>)}
    </div>
    <label className="quote-mount__include"><input type="checkbox" checked={included} onChange={event => onInclude(event.target.checked)} />Incluir esta mesa en mi cotización</label>
  </div>
}
