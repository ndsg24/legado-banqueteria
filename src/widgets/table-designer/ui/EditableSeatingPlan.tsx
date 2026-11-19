import { useI18n } from '../../../shared/i18n'
import { useId, useRef, useState, type Ref } from 'react'
import { Button, Dialog, Heading, Popover } from 'react-aria-components'
import { changeRoundSeat, maxHeadSeats, type TableDesign } from '../../../entities/table'
import { SeatingPlan, type PlanTable } from '../../../features/preview-table'

type Props = {
  design: TableDesign
  planRef: Ref<SVGSVGElement>
  onChange: (patch: Partial<TableDesign>) => void
}

export function EditableSeatingPlan({ design, planRef, onChange }: Props) {
  const { t } = useI18n()

  const [selected, setSelected] = useState<PlanTable | null>(null)
  const anchor = useRef<SVGGElement>(null)
  const hint = useId()
  function close() {
    setSelected(null)
    anchor.current?.focus({ preventScroll: true })
  }

  const isHead = selected === 'head'
  const currentCount =
    typeof selected === 'number'
      ? (design.roundSeats?.[selected] ?? design.chairs)
      : design.headSeats
  const first = isHead ? 2 : 6
  const last = isHead ? maxHeadSeats : 10

  function choose(count: number) {
    if (selected === null) return
    onChange(selected === 'head' ? { headSeats: count } : changeRoundSeat(design, selected, count))
    close()
  }

  return (
    <div className="seating-editor">
      <div className="table-studio__plan" aria-describedby={hint}>
        <SeatingPlan
          design={design}
          planRef={planRef}
          selected={selected}
          onPick={(table, node) => {
            anchor.current = node
            node.focus({ preventScroll: true })
            setSelected(table)
          }}
        />
      </div>
      <p id={hint}>{t('table.plan.tapToEdit')}</p>
      <Popover
        isOpen={selected !== null}
        onOpenChange={(open) => {
          if (!open) close()
        }}
        triggerRef={anchor}
        placement="bottom"
        offset={4}
        containerPadding={10}
        className="seating-popover"
      >
        <Dialog aria-label={t('table.plan.editSeats')} className="seating-popover__dialog">
          <header>
            <Heading slot="title">
              {isHead ? t('table.plan.head') : `${t('table.plan.table')} ${Number(selected) + 1}`}
            </Heading>
            <Button onPress={close} aria-label={t('table.plan.close')}>
              ×
            </Button>
          </header>
          <fieldset>
            <legend>{t('table.plan.seats')}</legend>
            <div>
              {Array.from({ length: last - first + 1 }, (_, index) => first + index).map(
                (count) => (
                  <Button
                    key={count}
                    aria-label={`${count} ${t('table.plan.seatsUnit')}`}
                    aria-pressed={count === currentCount}
                    autoFocus={count === currentCount}
                    onPress={() => choose(count)}
                  >
                    {count}
                  </Button>
                ),
              )}
            </div>
          </fieldset>
        </Dialog>
      </Popover>
    </div>
  )
}
