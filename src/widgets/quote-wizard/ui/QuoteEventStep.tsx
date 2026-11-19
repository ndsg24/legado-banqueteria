import { validationMessage } from '../model/validationMessage'
import { useI18n } from '../../../shared/i18n'
import { Controller, useWatch, type UseFormReturn } from 'react-hook-form'
import {
  eventLabels,
  eventTypes,
  guestRange,
  type QuoteRequest,
  displayDate,
} from '../../../entities/quote'
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
  const { t, locale } = useI18n()

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
      <fieldset disabled={isSubmitting} aria-label={t('quote.review.event')}>
        <fieldset
          className="quote-event-types"
          aria-describedby={errors.event ? 'quote-event-error' : undefined}
        >
          <legend>{t('quote.review.eventType')}</legend>
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
                  {t(eventLabels[event])}
                </span>
              </label>
            ))}
          </div>
          <small
            className="quote-error"
            id="quote-event-error"
            role={errors.event ? 'alert' : undefined}
          >
            {validationMessage(errors.event?.message, t)}
          </small>
        </fieldset>
        <div className="quote-fields">
          <Controller
            name="guests"
            control={control}
            render={({ field, fieldState }) => (
              <QuoteField label={t('quote.event.guestCount')} error={fieldState.error?.message}>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  placeholder={guestRange.min + '–' + guestRange.max}
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
          <strong>{t(event ? eventLabels[event] : 'quote.event.celebration')}</strong>
          <span>
            {[
              locationName?.trim(),
              Number.isFinite(guests) && guests > 0
                ? guests + ' ' + t('quote.event.guestUnit')
                : '',
            ]
              .filter(Boolean)
              .join(' · ')}
          </span>
          <span>{displayDate(date, locale, t)}</span>
        </figcaption>
      </figure>
    </div>
  )
}
