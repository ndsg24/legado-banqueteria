import type { MessageKey } from '@legado/domain/i18n/messages'
import type { TableDesign } from '@legado/domain/table/types'
import { useI18n } from '../../i18n'
import { EditorialArrow } from '../../ui/atoms/EditorialArrow'
import { SeatingPlan } from '../SeatingPlan'
import type { TableView } from './TableScene'
import type { useTableScene } from './useTableScene'
import './viewer.css'

const viewpoints: readonly { id: TableView; label: MessageKey }[] = [
  { id: 'table', label: 'table.view.table' },
  { id: 'chairs', label: 'table.view.chairs' },
  { id: 'overhead', label: 'table.view.overhead' },
  { id: 'centerpiece', label: 'table.view.centerpiece' },
  { id: 'setting', label: 'table.view.setting' },
]

type Props = {
  design: TableDesign
  scene: Pick<ReturnType<typeof useTableScene>, 'canvasRef' | 'status' | 'view' | 'setView'>
  combination?: string
  editable?: boolean
  hidden?: boolean
}

export function TableSceneViewer({ design, scene, combination, editable, hidden }: Props) {
  const { t } = useI18n()
  const { canvasRef, status, view, setView } = scene
  const ready = status === 'ready'
  const summary = design.roundTables
    ? t('table.view.seatSummary', {
        table: t(design.roundTables > 1 ? 'table.view.firstTable' : 'table.view.roundTable'),
        count: design.roundSeats?.[0] ?? design.chairs,
      })
    : t('table.view.sample')
  const description = t('table.view.description')
  return (
    <div className="table-studio__scene" data-status={status} hidden={hidden}>
      <div className="table-studio__scene-label">
        <span>{summary}</span>
        {combination && <span>{combination}</span>}
      </div>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={editable ? description + ' ' + t('table.view.controls') : description}
        aria-hidden={!ready}
      />
      {!hidden && !ready && (
        <>
          <div className="table-studio__fallback-plan">
            <SeatingPlan design={design} />
          </div>
          <p className="table-studio__loading" role="status">
            {t(status === 'loading' ? 'table.view.loading' : 'table.view.unavailable')}
            {status === 'error' && editable && ' ' + t('table.view.fallback')}
          </p>
        </>
      )}
      {ready && (
        <div className="table-studio__view-controls">
          <p className="table-studio__gesture">
            <EditorialArrow direction="both" /> {t('table.view.rotate')}
            {editable && (
              <>
                <span aria-hidden="true">·</span> {t('table.view.editFabric')}
              </>
            )}
          </p>
          <div className="table-studio__views" role="group" aria-label={t('table.view.viewpoint')}>
            {viewpoints.map(({ id, label }) => (
              <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)}>
                {t(label)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
