import { Controller, useWatch, type UseFormReturn } from 'react-hook-form'
import { eventTypes, guestRange, type QuoteRequest } from '../../quote/request'
import { displayDate } from '../../quote/review'
import { EventIcon } from './EventIcon'
import { EventDatePicker } from './EventDatePicker'
import { EventCommuneSelect } from './EventCommuneSelect'
import { QuoteField } from './QuoteField'

const invitationPhotos: Record<(typeof eventTypes)[number], string> = {
  Matrimonio: 'event-04.jpg',
  'Encuentro familiar': 'event-01.jpg',
  'Evento de empresa': 'event-03.jpg',
  'Otra celebración': 'event-night-800.webp',
}

type Props = { form: UseFormReturn<QuoteRequest> }

export function QuoteEventStep({ form }: Props) {
  const {
    control,
    register,
    formState: { errors, isSubmitting },
  } = form
  const [event, guests, locationName, date] = useWatch({
    control,
    name: ['event', 'guests', 'location', 'date'],
  })
  return (
    <div className="quote-opening">
      <fieldset disabled={isSubmitting} aria-label="El evento">
        <fieldset
          className="quote-event-types"
          aria-describedby={errors.event ? 'quote-event-error' : undefined}
        >
          <legend>Tipo de evento</legend>
          <div>
            {eventTypes.map((event) => (
              <label key={event}>
                <input
                  type="radio"
                  {...register('event')}
                  value={event}
                  aria-invalid={!!errors.event}
                />
                <span>
                  <EventIcon event={event} />
                  {event}
                </span>
              </label>
            ))}
          </div>
          <small
            className="quote-error"
            id="quote-event-error"
            role={errors.event ? 'alert' : undefined}
          >
            {errors.event?.message}
          </small>
        </fieldset>
        <div className="quote-fields">
          <Controller
            name="guests"
            control={control}
            render={({ field, fieldState }) => (
              <QuoteField label="Invitados aproximados" error={fieldState.error?.message}>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  placeholder={guestRange.min + ' a ' + guestRange.max}
                  ref={field.ref}
                  name={field.name}
                  onBlur={field.onBlur}
                  aria-invalid={!!fieldState.error}
                  value={Number.isFinite(field.value) ? field.value : ''}
                  onChange={(e) => {
                    const digits = e.target.value
                    if (/^\d*$/.test(digits) && Number.isSafeInteger(Number(digits)))
                      field.onChange(digits ? Number(digits) : NaN)
                  }}
                />
              </QuoteField>
            )}
          />
          <Controller
            name="location"
            control={control}
            render={({ field, fieldState }) => (
              <EventCommuneSelect
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                triggerRef={field.ref}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="date"
            control={control}
            render={({ field, fieldState }) => (
              <EventDatePicker
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                triggerRef={field.ref}
                error={fieldState.error?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </div>
      </fieldset>
      <figure className="quote-invitation">
        <img
          key={event}
          src={
            import.meta.env.BASE_URL +
            'images/gallery/' +
            (invitationPhotos[event] ?? 'event-06.jpg')
          }
          alt=""
        />
        <figcaption>
          <strong>{event || 'Tu celebración'}</strong>
          <span>
            {[
              locationName?.trim(),
              Number.isFinite(guests) && guests > 0 ? guests + ' invitados' : '',
            ]
              .filter(Boolean)
              .join(' · ')}
          </span>
          <span>{displayDate(date)}</span>
        </figcaption>
      </figure>
    </div>
  )
}
