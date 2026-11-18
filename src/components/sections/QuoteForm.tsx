import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { QuoteReview, type TablePicture } from '../quote/QuoteReview'
import { QuoteMenu } from '../quote/QuoteMenu'
import { QuoteTablePreview } from '../quote/QuoteTablePreview'
import { siteConfig } from '../../config/site'
import { readTableDesign, tableStorageKey } from '../../table/design'
import { quoteMessage, quoteSchema } from '../../quote/request'
import type { QuoteRequest } from '../../quote/request'
import {
  readQuantities,
  saveQuantities,
  withQuantity,
  writeSelectionParams,
} from '../../quote/quantities'
import { readSauceChoices, writeSauceChoices, type SauceChoices } from '../../quote/sauces'
import { EditorialArrow } from '../ui/EditorialArrow'

import { steps } from '../../quote/steps'
import { QuoteProgress } from '../quote/QuoteProgress'
import { QuoteEventStep } from '../quote/QuoteEventStep'
import { QuoteField } from '../quote/QuoteField'

const endpoint = import.meta.env.VITE_QUOTE_ENDPOINT?.trim()

const lastStep = steps.length - 1
export default function QuoteForm() {
  const [params] = useState(() => new URLSearchParams(location.search))
  const [initialItems] = useState(() => readQuantities(params))
  const [design, setDesign] = useState(() =>
    readTableDesign(params.get('mesa') === '1' ? params : undefined),
  )
  const form = useForm<QuoteRequest>({
    resolver: zodResolver(quoteSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      date: '',
      location: '',
      notes: '',
      items: initialItems,
      sauces: readSauceChoices(params, initialItems),
      table: params.get('mesa') === '1' ? design : null,
    },
  })
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = form
  const selected = watch('items')
  const sauces = watch('sauces') ?? {}
  const table = watch('table')
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
      location.href =
        'mailto:' +
        siteConfig.email +
        '?subject=' +
        encodeURIComponent('Mi cotización · Legado') +
        '&body=' +
        encodeURIComponent(quoteMessage(quote))
      setNotice('Revisa y envía el borrador desde tu aplicación de correo.')
      return
    }
    inFlight.current = true
    setSending(true)
    setNotice('')
    try {
      const payload = JSON.stringify(quote)
      if (attempt.current.payload !== payload)
        attempt.current = { payload, id: crypto.randomUUID() }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: attempt.current.id, quote }),
        signal: AbortSignal.timeout(20000),
      })
      if (res.status === 202 && (await res.json()).accepted === true) {
        setSent(true)
        return
      }
      setNotice(
        res.status === 429
          ? 'Espera un minuto y vuelve a intentarlo.'
          : 'No pudimos confirmar el envío. Revisa los datos y reintenta.',
      )
    } catch {
      setNotice('No pudimos confirmar el envío. Tu solicitud sigue aquí para reintentar.')
    } finally {
      inFlight.current = false
      setSending(false)
    }
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
      await handleSubmit(
        (data) => {
          setReview(data)
          goTo(lastStep)
        },
        (invalid) => {
          const first = steps.findIndex((part) => part.fields.some((field) => field in invalid))
          if (first >= 0 && first !== step) goTo(first)
        },
      )()
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
    } finally {
      setDownloading(false)
    }
  }

  return (
    <form className="quote-form" noValidate onSubmit={advance}>
      <QuoteProgress
        ref={progress}
        step={step}
        sent={sent}
        busy={isSubmitting || downloading || sending}
        onGoTo={goTo}
      />
      <div className="quote-chapter" data-opening={step === 0} key={step}>
        <h2 ref={heading} tabIndex={-1}>
          {steps[step].title}
        </h2>
        {step === 0 && <QuoteEventStep form={form} />}
        {step === 1 && (
          <fieldset disabled={isSubmitting} id="quote-menu">
            <legend>Platos y bebestibles</legend>
            <QuoteMenu
              selected={selected}
              onQuantityChange={setQuantity}
              sauces={sauces}
              onSauceChange={setSauce}
            />
          </fieldset>
        )}
        {step === 2 && (
          <div className="quote-montage">
            <fieldset disabled={isSubmitting}>
              <legend>Tu mesa</legend>
              <QuoteTablePreview
                design={design}
                included={!!table}
                onInclude={(include) => setValue('table', include ? design : null)}
              />
            </fieldset>
            <fieldset disabled={isSubmitting}>
              <legend>Detalles del evento</legend>
              <QuoteField
                label="Preferencias, restricciones alimentarias u otros detalles (opcional)"
                error={errors.notes?.message}
              >
                <textarea
                  rows={6}
                  maxLength={1500}
                  {...register('notes')}
                  aria-invalid={!!errors.notes}
                />
              </QuoteField>
            </fieldset>
          </div>
        )}
        {step === 3 && (
          <fieldset disabled={isSubmitting}>
            <legend>Tus datos de contacto</legend>
            <div className="quote-fields">
              <QuoteField label="Nombre" error={errors.name?.message}>
                <input
                  autoComplete="name"
                  maxLength={100}
                  {...register('name')}
                  aria-invalid={!!errors.name}
                />
              </QuoteField>
              <QuoteField label="Correo electrónico" error={errors.email?.message}>
                <input
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                />
              </QuoteField>
              <QuoteField label="Teléfono (opcional)" error={errors.phone?.message}>
                <input
                  type="tel"
                  autoComplete="tel"
                  {...register('phone')}
                  aria-invalid={!!errors.phone}
                />
              </QuoteField>
            </div>
          </fieldset>
        )}
        {step === lastStep && review && <QuoteReview quote={review} picture={picture} />}
      </div>
      {sent && <p role="status">Solicitud recibida. Te responderemos al correo indicado.</p>}
      <div className="quote-actions">
        {step > 0 && !sent && (
          <button
            type="button"
            className="quote-back"
            disabled={isSubmitting || sending || downloading}
            onClick={() => goTo(step - 1)}
          >
            <EditorialArrow direction="left" /> Atrás
          </button>
        )}
        {step === lastStep && (
          <button
            type="button"
            className="quote-download"
            onClick={download}
            disabled={downloading || sending}
          >
            <EditorialArrow direction="down" />
            {downloading ? 'Preparando PDF…' : 'Descargar PDF'}
          </button>
        )}
        {!sent && (
          <button
            type="submit"
            className="button--gold"
            disabled={isSubmitting || downloading || sending}
          >
            {step === lastStep
              ? sending
                ? 'Enviando…'
                : endpoint
                  ? 'Enviar solicitud'
                  : 'Preparar correo'
              : step === lastStep - 1
                ? 'Revisar mi cotización'
                : 'Continuar'}{' '}
            <EditorialArrow />
          </button>
        )}
      </div>
      {step === lastStep && !sent && (
        <p>
          {endpoint
            ? 'Usaremos tus datos para responder esta solicitud.'
            : 'Al preparar el correo se abrirá tu aplicación con el resumen listo para enviar.'}
        </p>
      )}
      <p role="status" aria-live="polite">
        {notice}
      </p>
    </form>
  )
}
