import { DetailIcon } from '@legado/brand/controls'
import { validationMessage } from '../model/validationMessage'
import { useI18n } from '../../../shared/i18n'
import { useId, useState, type Ref } from 'react'
import { parseDate } from '@internationalized/date'
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  Dialog,
  DialogTrigger,
  Heading,
  Popover,
} from 'react-aria-components'
import { eventDateRange, eventTimeZone } from '../../../entities/quote'
import type { DateAvailability } from '../model/useDateAvailability'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'

type Props = {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  triggerRef: Ref<HTMLButtonElement>
  error?: string
  disabled: boolean
  availability: DateAvailability
}

export function EventDatePicker({
  value,
  onChange,
  onBlur,
  triggerRef,
  error,
  disabled,
  availability,
}: Props) {
  const { t, locale } = useI18n()
  const fieldError = availability.booked.has(value) ? 'quote.calendar.booked' : error
  const format = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: eventTimeZone,
  })

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
    <div className="quote-field" data-invalid={!!fieldError || undefined}>
      <span className="quote-event-detail-label" id={labelId}>
        <DetailIcon kind="date" />
        {t('quote.calendar.label')}
      </span>
      <DialogTrigger
        isOpen={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (next) void availability.refresh()
        }}
      >
        <Button
          className="quote-date-trigger"
          ref={triggerRef}
          isDisabled={disabled}
          onBlur={onBlur}
          aria-labelledby={labelId + ' ' + valueId}
          aria-describedby={fieldError ? errorId : undefined}
          aria-invalid={!!fieldError}
        >
          <span id={valueId}>
            {selected ? format.format(selected.toDate(eventTimeZone)) : t('quote.calendar.choose')}
          </span>
          <svg
            aria-hidden="true"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Button>
        <Popover
          className="quote-calendar-popover"
          placement="bottom start"
          offset={8}
          containerPadding={8}
        >
          <Dialog aria-label={t('quote.calendar.dialog')} className="quote-calendar-dialog">
            <Calendar
              aria-label={t('quote.calendar.label')}
              value={availability.booked.has(value) ? null : selected}
              defaultFocusedValue={selected ?? first}
              isReadOnly={availability.status === 'loading'}
              isDateUnavailable={(day) => availability.booked.has(day.toString())}
              minValue={first}
              maxValue={last}
              onChange={(date) => select(date.toString())}
            >
              <header>
                <Button slot="previous" aria-label={t('quote.calendar.previous')}>
                  <EditorialArrow direction="left" />
                </Button>
                <Heading />
                <Button slot="next" aria-label={t('quote.calendar.next')}>
                  <EditorialArrow />
                </Button>
              </header>
              <CalendarGrid weekdayStyle="short">
                {(date) => <CalendarCell date={date} />}
              </CalendarGrid>
            </Calendar>
            <div className="quote-calendar-status" aria-live="polite">
              {availability.status === 'loading' && t('quote.calendar.checking')}
              {availability.status === 'ready' &&
                availability.booked.size > 0 &&
                t('quote.calendar.bookedLegend')}
              {availability.status === 'error' && (
                <>
                  <span>{t('quote.calendar.unverified')}</span>
                  <Button onPress={() => void availability.refresh()}>
                    {t('quote.calendar.retry')}
                  </Button>
                </>
              )}
            </div>
            <div className="quote-calendar-footer">
              <span>
                {t('quote.calendar.until')} {format.format(last.toDate(eventTimeZone))}
              </span>
            </div>
          </Dialog>
        </Popover>
      </DialogTrigger>
      <small className="quote-error" id={errorId} role={fieldError ? 'alert' : undefined}>
        {validationMessage(fieldError, t)}
      </small>
    </div>
  )
}
