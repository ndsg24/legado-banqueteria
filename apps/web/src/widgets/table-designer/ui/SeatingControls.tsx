import { NativeSelect } from '@legado/brand/controls'
import { useI18n } from '../../../shared/i18n'
import { useId } from 'react'
import {
  roundSeatLayout,
  seatsByTable,
  maxHeadSeats,
  maxRoundTables,
  totalSeats,
  type TableDesign,
} from '../../../entities/table'

type Layout = Pick<TableDesign, 'roundTables' | 'chairs' | 'roundSeats' | 'headSeats'>

export function Count({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  const { t } = useI18n()

  const id = useId()
  return (
    <div className="seating-count">
      <label htmlFor={id}>{label}</label>
      <div>
        <button
          type="button"
          disabled={value <= min}
          aria-label={t('table.plan.decrease') + ' ' + label}
          onClick={() => onChange(value - 1)}
        >
          −
        </button>
        <NativeSelect
          id={id}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        >
          {Array.from({ length: max - min + 1 }, (_, i) => (
            <option key={i} value={min + i}>
              {min + i}
            </option>
          ))}
        </NativeSelect>
        <button
          type="button"
          disabled={value >= max}
          aria-label={t('table.plan.increase') + ' ' + label}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  )
}

export function SeatingControls({
  design,
  onChange,
}: {
  design: TableDesign
  onChange: (patch: Partial<Layout>) => void
}) {
  const { t } = useI18n()

  function resize(roundTables: number) {
    onChange({ roundTables, ...roundSeatLayout(seatsByTable(design, roundTables), design.chairs) })
  }
  return (
    <div className="seating-controls">
      <Count
        label={t('table.plan.roundTables')}
        min={design.headSeats ? 0 : 1}
        max={maxRoundTables}
        value={design.roundTables}
        onChange={resize}
      />
      {design.roundTables > 0 && (
        <Count
          label={design.roundSeats ? t('table.plan.newTableSeats') : t('table.plan.seatsPerTable')}
          min={6}
          max={10}
          value={design.chairs}
          onChange={(chairs) => onChange({ chairs })}
        />
      )}
      <label className="seating-controls__head">
        <input
          type="checkbox"
          checked={design.headSeats > 0}
          onChange={(e) =>
            onChange(
              e.target.checked
                ? { headSeats: 2 }
                : { headSeats: 0, roundTables: Math.max(1, design.roundTables) },
            )
          }
        />
        {t('table.plan.includeHead')}
      </label>
      {design.headSeats > 0 && (
        <Count
          label={t('table.plan.headSeats')}
          min={2}
          max={maxHeadSeats}
          value={design.headSeats}
          onChange={(headSeats) => onChange({ headSeats })}
        />
      )}
      <p className="seating-controls__total" role="status">
        {t('table.plan.totalSeats')} <strong>{totalSeats(design)}</strong>
      </p>
      <p className="table-studio__note">{t('table.plan.disclaimer')}</p>
    </div>
  )
}
