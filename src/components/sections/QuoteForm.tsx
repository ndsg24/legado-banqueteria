import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { QuoteReview, type TablePicture } from '../quote/QuoteReview'
import { displayDate } from '../../quote/review'
import { EventIcon } from '../quote/EventIcon'
import { QuoteMenu } from '../quote/QuoteMenu'
import { QuoteTablePreview } from '../quote/QuoteTablePreview'
import { siteConfig } from '../../config/site'
import { readTableDesign, tableStorageKey } from '../../hooks/useTableDesign'
import { eventTypes, guestRange, quoteMessage, quoteSchema } from '../../quote/request'
import type { QuoteRequest } from '../../quote/request'
import { readQuantities, saveQuantities, withQuantity, writeSelectionParams } from '../../quote/quantities'
import { readSauceChoices, writeSauceChoices, type SauceChoices } from '../../quote/sauces'
import { EditorialArrow } from '../ui/EditorialArrow'
import { EventDatePicker } from '../quote/EventDatePicker'
import { EventCommuneSelect } from '../quote/EventCommuneSelect'

const endpoint = import.meta.env.VITE_QUOTE_ENDPOINT?.trim()

const steps = [
  { label: 'Evento', icon: 'M4 5h16v15H4z M8 3v4m8-4v4M4 10h16m-12 4h2m4 0h2', title: '¿Qué celebramos?', fields: ['event', 'guests', 'location', 'date'] },
  { label: 'Carta', icon: 'M4 15a8 8 0 0 1 16 0M2 16h20M4 20h16M12 5V3', title: '¿Qué servimos?', fields: ['items', 'sauces'] },
  { label: 'Mesa', icon: 'M3 11c0-4 18-4 18 0s-18 4-18 0Zm2 2-1 7m15-7 1 7M9 7V4h6v3', title: '¿Cómo vestimos la mesa?', fields: ['table', 'notes'] },
  { label: 'Contacto', icon: 'M3 5h18v14H3z M3 6l9 7 9-7', title: '¿A quién le escribimos?', fields: ['name', 'email', 'phone'] },
  { label: 'Revisión', icon: 'M6 3h9l4 4v14H6z M15 3v5h4M9 14l2 2 5-5', title: 'Tu celebración, en detalle.', fields: [] },
] satisfies { label: string; icon: string; title: string; fields: (keyof QuoteRequest)[] }[]
const lastStep = steps.length - 1
const invitationPhotos: Record<typeof eventTypes[number], string> = {
  Matrimonio: 'event-04.jpg',
  'Encuentro familiar': 'event-01.jpg',
  'Evento de empresa': 'event-03.jpg',
  'Otra celebración': 'event-night-800.webp',
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="quote-field"><span>{label}</span>{children}<small className="quote-error" role={error ? 'alert' : undefined}>{error}</small></label>
}

export default function QuoteForm() {
  const [params] = useState(() => new URLSearchParams(location.search))
  const [initialItems] = useState(() => readQuantities(params))
  const [design, setDesign] = useState(() => readTableDesign(params.get('mesa') === '1' ? params : undefined))
  const { control, register, handleSubmit, trigger, watch, setValue, getValues, formState: { errors, isSubmitting } } = useForm<QuoteRequest>({
    resolver: zodResolver(quoteSchema), mode: 'onBlur',
    defaultValues: {
      name: '', email: '', phone: '', date: '', location: '', notes: '',
      items: initialItems, sauces: readSauceChoices(params, initialItems),
      table: params.get('mesa') === '1' ? design : null,
    },
  })
  const selected = watch('items')
  const sauces = watch('sauces') ?? {}
  const table = watch('table')
  const [event, guests, locationName, date] = watch(['event', 'guests', 'location', 'date'])
  const [step, setStep] = useState(0)
  const [review, setReview] = useState<QuoteRequest | null>(null)
  const [downloading, setDownloading] = useState(false)
  const picture = useRef<TablePicture>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const progress = useRef<HTMLElement>(null)
  const previousStep = useRef(step)
  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step
    heading.current?.focus({ preventScroll: true })
    progress.current?.scrollIntoView({ block: 'start' })
  }, [step])
  const [notice, setNotice] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const attempt = useRef({ payload: '', id: '' })
  const inFlight = useRef(false)

  useEffect(() => {
    function syncDesign(event: StorageEvent) {
      if (event.key !== tableStorageKey) return
      const next = readTableDesign()
      setDesign(next)
      if (getValues('table')) setValue('table', next)
    }
    window.addEventListener('storage', syncDesign)
    return () => window.removeEventListener('storage', syncDesign)
  }, [getValues, setValue])

  function updateMenuLink(items: QuoteRequest['items'], choices: SauceChoices) {
    const url = new URL(location.href)
    if (url.searchParams.has('plato') || Object.keys(choices).length) {
      writeSelectionParams(url.searchParams, items)
      writeSauceChoices(url.searchParams, choices)
      history.replaceState(history.state, '', url)
    }
  }

  function setQuantity(id: string, quantity: number) {
    const next = withQuantity(getValues('items'), id, quantity)
    const choices = { ...getValues('sauces') }
    if (!next[id] && choices[id]) {
      delete choices[id]
      setValue('sauces', choices, { shouldDirty: true })
    }
    setValue('items', next, { shouldDirty: true })
    saveQuantities(next)
    updateMenuLink(next, choices)
  }

  function setSauce(main: string, sauce: string) {
    const choices = { ...getValues('sauces') }
    if (sauce) choices[main] = sauce
    else delete choices[main]
    setValue('sauces', choices, { shouldDirty: true })
    updateMenuLink(getValues('items'), choices)
  }

  async function submit(quote: QuoteRequest) {
    if (inFlight.current) return
    if (!endpoint) {
      location.href = 'mailto:' + siteConfig.email + '?subject=' + encodeURIComponent('Mi cotización · Legado') + '&body=' + encodeURIComponent(quoteMessage(quote))
      setNotice('Revisa y envía el borrador desde tu aplicación de correo.')
      return
    }
    inFlight.current = true
    setSending(true)
    setNotice('')
    try {
      const payload = JSON.stringify(quote)
      if (attempt.current.payload !== payload) attempt.current = { payload, id: crypto.randomUUID() }
      const res = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: attempt.current.id, quote }), signal: AbortSignal.timeout(20000),
      })
      if (res.status === 202 && (await res.json()).accepted === true) { setSent(true); return }
      setNotice(res.status === 429 ? 'Espera un minuto y vuelve a intentarlo.' : 'No pudimos confirmar el envío. Revisa los datos y reintenta.')
    } catch { setNotice('No pudimos confirmar el envío. Tu solicitud sigue aquí para reintentar.') }
    finally { inFlight.current = false; setSending(false) }
  }

  function goTo(index: number) {
    setNotice('')
    setStep(index)
  }

  async function advance(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sent || isSubmitting || downloading) return
    if (step === lastStep) {
      if (review) await submit(review)
      return
    }
    if (step === lastStep - 1) {
      await handleSubmit(data => {
        setReview(data)
        goTo(lastStep)
      }, invalid => {
        const first = steps.findIndex(part => part.fields.some(field => field in invalid))
        if (first >= 0 && first !== step) goTo(first)
      })()
      return
    }
    if (await trigger(steps[step].fields, { shouldFocus: true })) goTo(step + 1)
  }

  async function download() {
    if (!review || downloading) return
    setDownloading(true)
    setNotice('')
    try {
      const { downloadQuotePdf } = await import('../../quote/pdf')
      await downloadQuotePdf(review, await picture.current?.capture())
    } catch {
      setNotice('No pudimos preparar el PDF. Puedes reintentar la descarga.')
    } finally { setDownloading(false) }
  }

  return <form className="quote-form" noValidate onSubmit={advance}>
    <nav className="quote-progress" aria-label="Pasos de la cotización" ref={progress}>
      <ol>{steps.map((part, index) => {
        const completed = index < step || sent
        return <li key={part.label} data-completed={completed}>
          <button type="button" onClick={() => goTo(index)} disabled={index >= step || sent || isSubmitting || downloading || sending}
            aria-current={index === step && !sent ? 'step' : undefined}
            aria-label={`Paso ${index + 1}, ${part.label}${completed ? ', completado' : ''}`}>
            <span className="quote-progress__marker" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={part.icon} /></svg>
              {String(index + 1).padStart(2, '0')}
              {completed && <svg className="quote-progress__check" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="m4 8 2.6 2.6L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>}
            </span>{part.label}
          </button>
        </li>
      })}</ol>
    </nav>
    <div className="quote-chapter" data-opening={step === 0} key={step}>
      <h2 ref={heading} tabIndex={-1}>{steps[step].title}</h2>
      {step === 0 && <div className="quote-opening">
        <fieldset disabled={isSubmitting} aria-label="El evento">
          <fieldset className="quote-event-types" aria-describedby={errors.event ? 'quote-event-error' : undefined}>
            <legend>Tipo de evento</legend>
            <div>{eventTypes.map(event => <label key={event}>
              <input type="radio" {...register('event')} value={event} aria-invalid={!!errors.event} />
              <span><EventIcon event={event} />{event}</span>
            </label>)}</div>
            <small className="quote-error" id="quote-event-error" role={errors.event ? 'alert' : undefined}>{errors.event?.message}</small>
          </fieldset>
          <div className="quote-fields">
            <Controller name="guests" control={control} render={({ field, fieldState }) =>
              <Field label="Invitados aproximados" error={fieldState.error?.message}>
                <input type="text" inputMode="numeric" pattern="[0-9]*" required placeholder={guestRange.min + ' a ' + guestRange.max}
                  ref={field.ref} name={field.name} onBlur={field.onBlur} aria-invalid={!!fieldState.error}
                  value={Number.isFinite(field.value) ? field.value : ''} onChange={e => {
                    const digits = e.target.value
                    if (/^\d*$/.test(digits) && Number.isSafeInteger(Number(digits))) field.onChange(digits ? Number(digits) : NaN)
                  }} />
              </Field>
            } />
            <Controller name="location" control={control} render={({ field, fieldState }) =>
              <EventCommuneSelect value={field.value} onChange={field.onChange} onBlur={field.onBlur}
                triggerRef={field.ref} error={fieldState.error?.message} />
            } />
            <Controller name="date" control={control} render={({ field, fieldState }) =>
              <EventDatePicker value={field.value} onChange={field.onChange} onBlur={field.onBlur}
                triggerRef={field.ref} error={fieldState.error?.message} disabled={isSubmitting} />
            } />
          </div>
        </fieldset>
        <figure className="quote-invitation">
          <img key={event} src={import.meta.env.BASE_URL + 'images/gallery/' + (invitationPhotos[event] ?? 'event-06.jpg')} alt="" />
          <figcaption><strong>{event || 'Tu celebración'}</strong>
            <span>{[locationName?.trim(), Number.isFinite(guests) && guests > 0 ? guests + ' invitados' : ''].filter(Boolean).join(' · ')}</span>
            <span>{displayDate(date)}</span>
          </figcaption>
        </figure>
      </div>}
      {step === 1 && <fieldset disabled={isSubmitting} id="quote-menu"><legend>Platos y bebestibles</legend>
        <QuoteMenu selected={selected} onQuantityChange={setQuantity} sauces={sauces} onSauceChange={setSauce} />
      </fieldset>}
      {step === 2 && <div className="quote-montage">
        <fieldset disabled={isSubmitting}><legend>Tu mesa</legend>
          <QuoteTablePreview design={design} included={!!table} onInclude={include => setValue('table', include ? design : null)} />
        </fieldset>
        <fieldset disabled={isSubmitting}><legend>Detalles del evento</legend>
          <Field label="Preferencias, restricciones alimentarias u otros detalles (opcional)" error={errors.notes?.message}><textarea rows={6} maxLength={1500} {...register('notes')} aria-invalid={!!errors.notes} /></Field>
        </fieldset>
      </div>}
      {step === 3 && <fieldset disabled={isSubmitting}><legend>Tus datos de contacto</legend><div className="quote-fields">
        <Field label="Nombre" error={errors.name?.message}><input autoComplete="name" maxLength={100} {...register('name')} aria-invalid={!!errors.name} /></Field>
        <Field label="Correo electrónico" error={errors.email?.message}><input type="email" autoComplete="email" {...register('email')} aria-invalid={!!errors.email} /></Field>
        <Field label="Teléfono (opcional)" error={errors.phone?.message}><input type="tel" autoComplete="tel" {...register('phone')} aria-invalid={!!errors.phone} /></Field>
      </div></fieldset>}
      {step === lastStep && review && <QuoteReview quote={review} picture={picture} />}
    </div>
    {sent && <p role="status">Solicitud recibida. Te responderemos al correo indicado.</p>}
    <div className="quote-actions">
      {step > 0 && !sent && <button type="button" className="quote-back" disabled={isSubmitting || sending || downloading}
        onClick={() => goTo(step - 1)}><EditorialArrow direction="left" /> Atrás</button>}
      {step === lastStep && <button type="button" className="quote-download" onClick={download} disabled={downloading || sending}>
        <EditorialArrow direction="down" />{downloading ? 'Preparando PDF…' : 'Descargar PDF'}
      </button>}
      {!sent && <button type="submit" className="button--gold" disabled={isSubmitting || downloading || sending}>
        {step === lastStep ? sending ? 'Enviando…' : endpoint ? 'Enviar solicitud' : 'Preparar correo'
          : step === lastStep - 1 ? 'Revisar mi cotización' : 'Continuar'} <EditorialArrow />
      </button>}
    </div>
    {step === lastStep && !sent && <p>{endpoint ? 'Usaremos tus datos para responder esta solicitud.' : 'Al preparar el correo se abrirá tu aplicación con el resumen listo para enviar.'}</p>}
    <p role="status" aria-live="polite">{notice}</p>
  </form>
}
