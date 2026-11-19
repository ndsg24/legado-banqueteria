import { useI18n } from '../../../shared/i18n'
import { CenterpieceControls } from './CenterpieceControls'
import {
  changeRoundSeat,
  dinnerwareStyles,
  isDinnerware,
  type TableDesign,
} from '../../../entities/table'
import type { TableView } from '../../../features/preview-table'

type Props = {
  design: TableDesign
  onChange: (patch: Partial<TableDesign>) => void
  onView: (view: TableView) => void
}

export function TableSettingControls({ design, onChange, onView }: Props) {
  const { t } = useI18n()

  const previewChairs = design.roundSeats?.[0] ?? design.chairs
  return (
    <>
      <fieldset>
        <legend>
          {design.roundSeats ? t('table.designer.firstTableSeats') : t('table.plan.seatsPerTable')}
        </legend>
        <div
          className="table-studio__seat-count"
          role="group"
          aria-label={t('table.designer.chairCount')}
        >
          {[6, 7, 8, 9, 10].map((count) => (
            <button
              type="button"
              key={count}
              aria-pressed={previewChairs === count}
              onClick={() =>
                onChange(design.roundSeats ? changeRoundSeat(design, 0, count) : { chairs: count })
              }
            >
              {count}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>{t('table.designer.dinnerware')}</legend>
        <div className="table-studio__flowers">
          {Object.keys(dinnerwareStyles)
            .filter(isDinnerware)
            .map((id) => (
              <button
                type="button"
                key={id}
                aria-pressed={design.dinnerware === id}
                onClick={() => onChange({ dinnerware: id })}
              >
                <i
                  className="plate-sample"
                  data-rim={id === 'goldRim'}
                  style={{ backgroundColor: dinnerwareStyles[id].color }}
                  aria-hidden="true"
                />
                {t(dinnerwareStyles[id].label)}
              </button>
            ))}
        </div>
      </fieldset>
      <CenterpieceControls
        design={design}
        onChange={(patch) => {
          onChange(patch)
          const empty =
            (patch.floral ?? design.floral) === 'none' &&
            (patch.bottleOutfit ?? design.bottleOutfit) === 'none'
          const nextView = empty ? 'table' : 'centerpiece'
          onView(nextView)
        }}
      />
    </>
  )
}
