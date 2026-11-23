import { useI18n } from '../i18n'
import type { KeyboardEvent, MouseEvent, Ref } from 'react'
import {
  dinnerwareStyles,
  fabricColor,
  seatsByTable,
  totalSeats,
} from '@legado/domain/table/options'
import type { TableDesign } from '@legado/domain/table/types'

export type PlanTable = number | 'head'
type Props = {
  design: TableDesign
  planRef?: Ref<SVGSVGElement>
  onPick?: (table: PlanTable, anchor: SVGGElement) => void
  selected?: PlanTable | null
}

export function SeatingPlan({ design, planRef, onPick, selected }: Props) {
  const { t } = useI18n()

  const { roundTables, headSeats } = design
  const columns = Math.max(1, Math.round(Math.sqrt(roundTables * 1.25)))
  const rows = Math.ceil(roundTables / columns)
  const withEnds = headSeats >= 3
  const headRow = withEnds ? headSeats - 2 : headSeats
  const headWidth = Math.max(96, headRow * 25 + 14)
  const width = Math.max(250, columns * 112 + 30, headSeats ? headWidth + 50 : 0)
  const top = headSeats ? 112 : 18
  const height = Math.max(150, top + rows * 122 + 18)
  const cloth = fabricColor(design.tablecloth).hex
  const overlay = fabricColor(design.overlay).hex
  const runner = design.overlayStyle === 'runner'
  const cover = fabricColor(design.chairCover).hex
  const plate = dinnerwareStyles[design.dinnerware].color
  const seats = (count: number) => Array.from({ length: count }, (_, index) => index)
  const place = (
    <>
      <rect
        x="-6"
        y="-4"
        width="12"
        height="8"
        rx="3"
        fill={cover}
        stroke="#756d60"
        strokeWidth=".8"
      />
      <circle cy="12" r="4.3" fill={plate} stroke="#99865e" strokeWidth=".7" />
    </>
  )

  function target(table: PlanTable, label: string) {
    if (!onPick) return {}
    return {
      role: 'button',
      tabIndex: 0,
      'aria-label': label,
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': selected === table,
      className: 'seating-plan__table',
      onClick: (event: MouseEvent<SVGGElement>) => onPick(table, event.currentTarget),
      onKeyDown: (event: KeyboardEvent<SVGGElement>) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        onPick(table, event.currentTarget)
      },
    }
  }

  const summary = t('table.plan.description', {
    tables: roundTables,
    head: headSeats,
    seats: totalSeats(design),
  })
  return (
    <svg
      ref={planRef}
      className="seating-plan"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      role={onPick ? 'group' : 'img'}
      aria-label={summary}
    >
      <rect
        x="6"
        y="6"
        width={width - 12}
        height={height - 12}
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeOpacity=".24"
        strokeWidth=".8"
      />
      {headSeats > 0 && (
        <g
          {...target('head', `${t('table.plan.head')}, ${headSeats} ${t('table.plan.seatsUnit')}`)}
          transform={`translate(${width / 2} 55)`}
        >
          <rect
            x={-headWidth / 2 - 12}
            y="-32"
            width={headWidth + 24}
            height="78"
            fill="transparent"
          />
          <text
            textAnchor="middle"
            y="38"
            fontFamily="sans-serif"
            fontSize="13"
            fill="currentColor"
          >
            {headSeats} {t('table.plan.seatsUnit')}
          </text>
          <rect
            x={-headWidth / 2}
            y="-19"
            width={headWidth}
            height="38"
            rx="2"
            fill={cloth}
            stroke="#83755d"
          />
          {runner ? (
            <rect x={-headWidth / 2} y="-5" width={headWidth} height="10" fill={overlay} />
          ) : (
            seats(Math.max(1, Math.floor(headWidth / 40))).map((_, i, pieces) => (
              <rect
                key={i}
                x="-13"
                y="-13"
                width="26"
                height="26"
                fill={overlay}
                transform={`translate(${((i + 0.5 - pieces.length / 2) * headWidth) / pieces.length} 0) rotate(45)`}
              />
            ))
          )}
          <text
            textAnchor="middle"
            y="3"
            fontFamily="sans-serif"
            fontSize="9"
            fill="#292721"
            stroke="#f4eddf"
            strokeWidth="2"
            paintOrder="stroke"
          >
            {t('table.plan.head')}
          </text>
          {seats(headRow).map((i) => (
            <g key={i} transform={`translate(${(i + 0.5 - headRow / 2) * 25} -25)`}>
              {place}
            </g>
          ))}
          {withEnds && (
            <>
              <g transform={`translate(${-headWidth / 2 - 6} 0) rotate(-90)`}>{place}</g>
              <g transform={`translate(${headWidth / 2 + 6} 0) rotate(90)`}>{place}</g>
            </>
          )}
        </g>
      )}
      {seatsByTable(design).map((chairs, i) => {
        const row = Math.floor(i / columns)
        const inRow = Math.min(columns, roundTables - row * columns)
        const x = width / 2 + ((i % columns) - (inRow - 1) / 2) * 112
        return (
          <g
            key={i}
            {...target(
              i,
              `${t('table.plan.table')} ${i + 1}, ${chairs} ${t('table.plan.seatsUnit')}`,
            )}
            transform={`translate(${x} ${top + row * 122 + 48})`}
          >
            <rect x="-47" y="-45" width="94" height="111" rx="8" fill="transparent" />
            <text
              textAnchor="middle"
              y="62"
              fontFamily="sans-serif"
              fontSize="13"
              fill="currentColor"
            >
              {chairs} {t('table.plan.seatsUnit')}
            </text>
            <circle r="32" fill={cloth} stroke="#83755d" />
            {runner ? (
              <rect x="-7" y="-31" width="14" height="62" rx="1" fill={overlay} />
            ) : (
              <rect
                x="-16"
                y="-16"
                width="32"
                height="32"
                rx="1"
                fill={overlay}
                transform="rotate(45)"
              />
            )}
            {seats(chairs).map((j) => (
              <g key={j} transform={`rotate(${(360 * j) / chairs}) translate(0 -39)`}>
                {place}
              </g>
            ))}
            <circle r="9" fill="#f4eddf" />
            <text textAnchor="middle" y="3.4" fontFamily="sans-serif" fontSize="10" fill="#292721">
              {i + 1}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
