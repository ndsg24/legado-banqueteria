import { QuoteDetailIcon } from './QuoteDetailIcon'
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

const invitationPhotos: Record<
  (typeof eventTypes)[number] | 'default',
  { file: string; preview: string; width: number }
> = {
  Matrimonio: { file: 'event-04.jpg', preview: 'event-04-560.webp', width: 1100 },
  'Encuentro familiar': { file: 'event-01.jpg', preview: 'event-01-560.webp', width: 1100 },
  'Evento de empresa': { file: 'event-03.jpg', preview: 'event-03-560.webp', width: 825 },
  'Otra celebración': { file: 'event-night-800.webp', preview: 'event-night-560.webp', width: 800 },
  default: { file: 'event-06.jpg', preview: 'event-06-560.webp', width: 1100 },
}
const gallery = import.meta.env.BASE_URL + 'images/gallery/'

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
  const photo = invitationPhotos[event] ?? invitationPhotos.default
  const sideBySide = window.matchMedia('(min-width: 801px)').matches
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
                <span className="quote-event-option">
                  <span className="quote-event-option__seal">
                    <EventIcon event={event} />
                  </span>
                  <span className="quote-event-option__name">{t(eventLabels[event])}</span>
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
        <div className="quote-event-details">
          <Controller
            name="guests"
            control={control}
            render={({ field, fieldState }) => (
              <div className="quote-field" data-invalid={fieldState.invalid || undefined}>
                <label className="quote-event-detail-label" htmlFor="quote-event-guests">
                  <QuoteDetailIcon kind="guests" />
                  {t('quote.event.guestCount')}
                </label>
                <div className="quote-guests-control">
                  <button
                    type="button"
                    aria-label={t('quote.event.fewerGuests')}
                    disabled={!Number.isFinite(field.value) || field.value <= guestRange.min}
                    onClick={() => field.onChange(Math.min(guestRange.max, field.value - 1))}
                  >
                    −
                  </button>
                  <input
                    id="quote-event-guests"
                    aria-describedby={fieldState.invalid ? 'quote-guests-error' : undefined}
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
                  <button
                    type="button"
                    aria-label={t('quote.event.moreGuests')}
                    disabled={field.value >= guestRange.max}
                    onClick={() => field.onChange(Math.max(guestRange.min, (field.value || 0) + 1))}
                  >
                    +
                  </button>
                </div>
                <small
                  className="quote-error"
                  id="quote-guests-error"
                  role={fieldState.invalid ? 'alert' : undefined}
                >
                  {validationMessage(fieldState.error?.message, t)}
                </small>
              </div>
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
          src={gallery + photo.file}
          srcSet={`${gallery}${photo.preview} 560w, ${gallery}${photo.file} ${photo.width}w`}
          sizes="auto, (max-width: 800px) 90vw, min(calc(38vw - 28px), 770px)"
          loading={sideBySide ? 'eager' : 'lazy'}
          fetchPriority={sideBySide ? 'high' : 'auto'}
          decoding="async"
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
