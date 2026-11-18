import { CenterpieceControls } from './CenterpieceControls'
import { changeRoundSeat, dinnerwareStyles, isDinnerware } from '../../config/table'
import type { TableDesign } from '../../types/table'
import type { TableView } from '../../rendering/table/TableScene'

type Props = {
  design: TableDesign
  onChange: (patch: Partial<TableDesign>) => void
  onView: (view: TableView) => void
}

export function TableSettingControls({ design, onChange, onView }: Props) {
  const previewChairs = design.roundSeats?.[0] ?? design.chairs
  return (
    <>
      <fieldset>
        <legend>{design.roundSeats ? 'Puestos de la mesa 1' : 'Puestos por mesa'}</legend>
        <div className="table-studio__seat-count" role="group" aria-label="Cantidad de sillas">
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
        <legend>Vajilla de referencia</legend>
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
                {dinnerwareStyles[id].label}
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
