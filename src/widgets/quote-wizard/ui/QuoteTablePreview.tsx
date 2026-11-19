import { useI18n } from '../../../shared/i18n'
import { SeatingPlan, useTableScene } from '../../../features/preview-table'
import {
  napkinFoldLabels,
  totalSeats,
  dinnerwareStyles,
  fabricColor,
  floralDetails,
  fabricPartLabel,
  tableDesignUrl,
  tableParts,
  type TableDesign,
} from '../../../entities/table'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'

type Props = { design: TableDesign; included: boolean; onInclude: (include: boolean) => void }

export function QuoteTablePreview({ design, included, onInclude }: Props) {
  const { t } = useI18n()

  const { canvasRef, status } = useTableScene(design)
  const tables = design.roundTables + Number(design.headSeats > 0)
  const editUrl = tableDesignUrl(design, import.meta.env.BASE_URL + 'ambientacion.html')
  return (
    <div className="quote-mount">
      {(design.roundTables !== 1 || design.headSeats > 0) && <SeatingPlan design={design} />}
      <div className="quote-mount__scene" hidden={design.roundTables === 0}>
        <canvas
          ref={canvasRef}
          aria-label={t('quote.setting.sceneLabel', {
            count: design.roundSeats?.[0] ?? design.chairs,
          })}
        />
        {status !== 'ready' && (
          <span role="status">
            {status === 'loading' ? t('table.view.loading') : t('table.view.unavailable')}
          </span>
        )}
      </div>
      <div className="quote-mount__caption">
        <span>
          {totalSeats(design)} {t('quote.setting.seatsSeparator')} {tables}{' '}
          {tables === 1 ? t('table.plan.tableUnit') : t('table.plan.tablesUnit')}
        </span>
        <a
          href={editUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('quote.setting.newTab')}
        >
          {t('quote.setting.edit')} <EditorialArrow direction="up-right" />
        </a>
      </div>
      <p>
        {t(dinnerwareStyles[design.dinnerware].label)} · {t(napkinFoldLabels[design.napkinFold])} ·{' '}
        {floralDetails(design, t)
          .map(([, value]) => value)
          .join(' · ')}
      </p>
      <div className="quote-mount__swatches" aria-label={t('quote.setting.fabrics')}>
        {tableParts.map((part) => (
          <span
            key={part}
            title={t(fabricPartLabel(part, design)) + ' · ' + t(fabricColor(design[part]).label)}
          >
            <i style={{ backgroundColor: fabricColor(design[part]).hex }} aria-hidden="true" />
            {t(fabricPartLabel(part, design))} · {t(fabricColor(design[part]).label)}
          </span>
        ))}
      </div>
      <label className="quote-mount__include">
        <input
          type="checkbox"
          checked={included}
          onChange={(event) => onInclude(event.target.checked)}
        />
        {t('quote.setting.include')}
      </label>
    </div>
  )
}
