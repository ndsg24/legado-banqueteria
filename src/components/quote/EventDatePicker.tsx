import { useId, useState } from 'react'
import type { Ref } from 'react'
import { parseDate } from '@internationalized/date'
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  Dialog,
  DialogTrigger,
  Heading,
  I18nProvider,
  Popover,
} from 'react-aria-components'
import { eventDateRange, eventTimeZone } from '../../quote/dates'
import { EditorialArrow } from '../ui/EditorialArrow'

type Props = {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  triggerRef: Ref<HTMLButtonElement>
  error?: string
  disabled: boolean
}

const format = new Intl.DateTimeFormat('es-CL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: eventTimeZone,
})

export function EventDatePicker({ value, onChange, onBlur, triggerRef, error, disabled }: Props) {
  const [open, setOpen] = useState(false)
  const { first, last } = eventDateRange()
  const selected = value ? parseDate(value) : null
  const labelId = useId()
  const valueId = useId()
  const errorId = useId()

  function select(next: string) {
    onChange(next)
    onBlur()
    setOpen(false)
  }

  return (
    <I18nProvider locale="es-CL">
      <div className="quote-field">
        <span id={labelId}>Fecha del evento</span>
        <DialogTrigger isOpen={open} onOpenChange={setOpen}>
          <Button
            className="quote-date-trigger"
            ref={triggerRef}
            isDisabled={disabled}
            onBlur={onBlur}
            aria-labelledby={labelId + ' ' + valueId}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={!!error}
          >
            <span id={valueId}>
              {selected ? format.format(selected.toDate(eventTimeZone)) : 'Elegir fecha'}
            </span>
            <svg
              aria-hidden="true"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M7 3v4m10-4v4M3 10h18" />
            </svg>
          </Button>
          <Popover
            className="quote-calendar-popover"
            placement="bottom start"
            offset={8}
            containerPadding={8}
          >
            <Dialog aria-label="Elegir la fecha del evento" className="quote-calendar-dialog">
              <Calendar
                aria-label="Fecha del evento"
                value={selected}
                defaultFocusedValue={selected ?? first}
                minValue={first}
                maxValue={last}
                onChange={(date) => select(date.toString())}
              >
                <header>
                  <Button slot="previous" aria-label="Mes anterior">
                    <EditorialArrow direction="left" />
                  </Button>
                  <Heading />
                  <Button slot="next" aria-label="Mes siguiente">
                    <EditorialArrow />
                  </Button>
                </header>
                <CalendarGrid weekdayStyle="short">
                  {(date) => <CalendarCell date={date} />}
                </CalendarGrid>
              </Calendar>
              <div className="quote-calendar-footer">
                <span>Hasta el {format.format(last.toDate(eventTimeZone))}</span>
              </div>
            </Dialog>
          </Popover>
        </DialogTrigger>
        <small className="quote-error" id={errorId} role={error ? 'alert' : undefined}>
          {error}
        </small>
      </div>
    </I18nProvider>
  )
}
