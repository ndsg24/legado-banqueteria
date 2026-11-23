import { eventDateUnavailableCode } from '@legado/domain/quote/availability'
import { toApiQuote } from '@legado/domain/quote/wire'
import { ActionButton } from '../../../shared/ui/ActionButton'
import { type MessageKey, useI18n } from '../../../shared/i18n'
import { useNavigate } from 'react-router'
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
  useState,
  type FormEvent,
  type ComponentType,
  type ReactNode,
} from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { TablePicture } from './QuoteReview'
import {
  isIdeasPreview,
  sundayMenu,
  tableIdeas,
  type TableIdea,
} from '../../../shared/config/tableIdea'
import { quoteEndpoint } from '../../../shared/config/quoteService'
import { useDateAvailability } from '../model/useDateAvailability'
import { isQuotePilot, siteConfig } from '../../../shared/config/site'
import { tableDesignUrl, type TableDesign } from '../../../entities/table'
import { quoteMessage, quoteSchema, type QuoteRequest } from '../../../entities/quote'
import { saveQuantities } from '../../../entities/menu'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'

import { initialQuote, saveDraft, clearDraft } from '../model/draft'
import { steps, type StepId } from '../model/steps'
import { QuoteProgress } from './QuoteProgress'
import { QuoteStepSkeleton } from './QuoteStepSkeleton'

const QuoteEventStep = lazy(() =>
  import('./QuoteEventStep').then((m) => ({ default: m.QuoteEventStep })),
)
const QuoteContactStep = lazy(() =>
  import('./QuoteContactStep').then((m) => ({ default: m.QuoteContactStep })),
)
const QuoteMenuStep = lazy(() => import('./QuoteMenuStep'))
const QuoteDietaryStep = lazy(() =>
  import('./QuoteDietaryStep').then((m) => ({ default: m.QuoteDietaryStep })),
)
const QuoteReview = lazy(() => import('./QuoteReview').then((m) => ({ default: m.QuoteReview })))

const lastStep = steps.length - 1
type Props = {
  idea?: TableIdea
  TableEditor: ComponentType<{
    design: TableDesign
    onChange: (next: TableDesign) => void
    serveSalmon?: boolean
    previewAction?: ReactNode
  }>
}

export function QuoteForm({ TableEditor, idea }: Props) {
  const { t, locale } = useI18n()

  const navigate = useNavigate()
  const [initial] = useState(() => initialQuote(new URLSearchParams(location.search)))
  const [design, setDesign] = useState(initial.design)
  const form = useForm<QuoteRequest>({
    resolver: zodResolver(quoteSchema),
    mode: 'onBlur',
    defaultValues: initial.values,
  })
  const {
    subscribe,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    getFieldState,
    formState: { isSubmitting },
  } = form
  const availability = useDateAvailability()
  const [checkingStep, setCheckingStep] = useState(false)
  const navigating = useRef(false)
  const [step, setStep] = useState(initial.step)
  const [furthestStep, setFurthestStep] = useState(initial.furthestStep)
  const editingReview = furthestStep === lastStep && step < lastStep
  const included = !!useWatch({ control: form.control, name: 'table' })
  const activeStep = steps[step]
  const [review, setReview] = useState<QuoteRequest | null>(initial.review)
  const [downloading, setDownloading] = useState(false)
  const picture = useRef<TablePicture>(null)
  const progress = useRef<HTMLElement>(null)
  const previousStep = useRef(step)
  const focusHeading = useCallback(
    (node: HTMLHeadingElement | null) => {
      if (!node || previousStep.current === step) return
      previousStep.current = step
      node.focus({ preventScroll: true })
    },
    [step],
  )
  const lastScrolledStep = useRef(step)
  useLayoutEffect(() => {
    if (lastScrolledStep.current !== step) {
      lastScrolledStep.current = step
      progress.current?.scrollIntoView({ block: 'start' })
    }
  }, [step])
  const [notice, setNotice] = useState<MessageKey | ''>('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const attempt = useRef(initial.attempt)
  const inFlight = useRef(false)

  useEffect(() => {
    if (sent) return
    const persist = () =>
      saveDraft(initial.key, step, getValues(), design, attempt.current, furthestStep)
    persist()
    return subscribe({ formState: { values: true }, callback: persist })
  }, [step, design, sent, subscribe, getValues, furthestStep, initial.key])

  function updateTable(next: TableDesign, include = true) {
    setDesign(next)
    setValue('table', include ? next : null, { shouldDirty: true })
    const url = new URL(tableDesignUrl(next))
    url.searchParams.set('mesa', include ? '1' : '0')
    void navigate(
      { search: url.search, hash: url.hash },
      { replace: true, preventScrollReset: true },
    )
  }

  async function submit(quote: QuoteRequest) {
    if (inFlight.current) return
    if (isIdeasPreview) {
      setSent(true)
      return
    }
    inFlight.current = true
    setSending(true)
    setNotice('')
    try {
      const payload = JSON.stringify(quote)
      // A retry of the same request must reach the server to recover its original receipt.
      if (!quoteEndpoint || attempt.current?.payload !== payload) {
        const booked = await availability.refresh()
        if ((booked ?? availability.booked).has(quote.date)) {
          showBookedDate(quote.date)
          return
        }
        if (!booked && !quoteEndpoint) {
          setNotice('quote.calendar.retryBeforeEmail')
          return
        }
      }
      if (!quoteEndpoint) {
        location.href =
          'mailto:' +
          siteConfig.email +
          '?subject=' +
          encodeURIComponent(t('quote.submit.mailSubject')) +
          '&body=' +
          encodeURIComponent(quoteMessage(quote, t))
        setNotice('quote.submit.mailDraft')
        return
      }
      if (attempt.current?.payload !== payload)
        attempt.current = { payload, id: crypto.randomUUID() }
      saveDraft(initial.key, step, getValues(), design, attempt.current, furthestStep)
      const res = await fetch(quoteEndpoint, {
        credentials: 'omit',
        redirect: 'error',
        referrerPolicy: 'no-referrer',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: attempt.current.id, quote: toApiQuote(quote) }),
        signal: AbortSignal.timeout(20000),
      })
      if (res.status === 202 && (await res.json()).accepted === true) {
        clearDraft(initial.key)
        if (!idea) saveQuantities({})
        void navigate(
          { search: idea ? '?idea=' + tableIdeas[idea].id : '', hash: location.hash },
          { replace: true, preventScrollReset: true },
        )
        setSent(true)
        return
      }
      if (res.status === 409 && (await res.json()).code === eventDateUnavailableCode) {
        showBookedDate(quote.date)
        return
      }
      setNotice(
        res.status === 429
          ? 'quote.submit.throttled'
          : isQuotePilot && res.status === 422
            ? 'quote.pilot.hint'
            : 'quote.submit.rejected',
      )
    } catch {
      setNotice('quote.submit.network')
    } finally {
      inFlight.current = false
      setSending(false)
    }
  }

  function goTo(index: number) {
    setNotice('')
    setFurthestStep((previous) => Math.max(previous, index))
    setStep(index)
  }

  function showBookedDate(date: string) {
    availability.markBooked(date)
    goTo(0)
    form.setError(
      'date',
      { type: 'unavailable', message: 'quote.calendar.booked' },
      { shouldFocus: true },
    )
  }

  function editSection(id: StepId) {
    goTo(steps.findIndex((part) => part.id === id))
  }

  async function navigateToStep(target: number) {
    if (sent || sending || isSubmitting || downloading || navigating.current || target === step)
      return
    if (target < step) {
      goTo(target)
      return
    }
    navigating.current = true
    const checkDate = step === 0 || target === lastStep
    if (checkDate) setCheckingStep(true)
    async function proceed() {
      if (checkDate) {
        const date = getValues('date')
        const result = await availability.refresh()
        if ((result ?? availability.booked).has(date)) {
          showBookedDate(date)
          return
        }
        goTo(target)
        if (!result) setNotice('quote.calendar.unverified')
      } else {
        goTo(target)
      }
    }
    try {
      if (target === lastStep) {
        await handleSubmit(
          async (data) => {
            setReview(data)
            await proceed()
          },
          (invalid) => {
            const first = steps.findIndex((part) => part.fields.some((field) => field in invalid))
            if (first >= 0 && first !== step) goTo(first)
          },
        )()
        return
      }
      const previous = steps.slice(0, target)
      const fields = previous.flatMap((part) => part.fields)
      if (await trigger(fields, { shouldFocus: true })) await proceed()
      else {
        const invalid = previous.findIndex((part) =>
          part.fields.some((field) => getFieldState(field).invalid),
        )
        if (invalid >= 0 && invalid !== step) goTo(invalid)
      }
    } finally {
      navigating.current = false
      if (checkDate) setCheckingStep(false)
    }
  }

  async function advance(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sent || sending || isSubmitting || downloading) return
    if (step === lastStep) {
      if (review) await submit(review)
      return
    }
    await navigateToStep(editingReview ? lastStep : step + 1)
  }

  async function download() {
    if (!review || downloading) return
    setDownloading(true)
    setNotice('')
    try {
      const { downloadQuotePdf } = await import('../lib/pdf')
      const tablePhoto = review.table ? await picture.current?.capture() : undefined
      await downloadQuotePdf(review, t, locale, tablePhoto)
    } catch {
      setNotice('quote.submit.pdfFailed')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <form className="quote-form table-watermark" noValidate onSubmit={advance}>
      <QuoteProgress
        control={form.control}
        ref={progress}
        step={step}
        furthestStep={furthestStep}
        sent={sent}
        busy={checkingStep || isSubmitting || downloading || sending}
        onGoTo={navigateToStep}
      />
      <div className="quote-form__body">
        <Suspense key={step} fallback={<QuoteStepSkeleton step={activeStep} />}>
          <div className="quote-chapter" data-step={activeStep.id}>
            <h2 ref={focusHeading} tabIndex={-1}>
              {t(activeStep.title)}
            </h2>
            {activeStep.id === 'event' && (
              <QuoteEventStep form={form} availability={availability} checking={checkingStep} />
            )}
            {activeStep.id === 'menu' && (
              <QuoteMenuStep form={form} rememberSelection={!idea && !isIdeasPreview} />
            )}
            {activeStep.id === 'dietary' && <QuoteDietaryStep form={form} />}
            {activeStep.id === 'table' && (
              <div className="quote-montage">
                <TableEditor
                  design={design}
                  serveSalmon={idea === 'dorada' && !!getValues('items')[sundayMenu.main]}
                  onChange={updateTable}
                  previewAction={
                    <ActionButton
                      type="button"
                      variant="secondary"
                      aria-pressed={included}
                      onPress={() => updateTable(design, !included)}
                    >
                      {included && <span aria-hidden="true">✓</span>}
                      {t(included ? 'quote.setting.included' : 'quote.setting.use')}
                    </ActionButton>
                  }
                />
              </div>
            )}
            {activeStep.id === 'contact' && <QuoteContactStep form={form} />}
            {step === lastStep && review && (
              <QuoteReview
                quote={review}
                picture={picture}
                onEdit={sent || sending || downloading ? undefined : editSection}
              />
            )}
          </div>
          {sent && (
            <p role="status">
              {t(
                isIdeasPreview
                  ? 'quote.idea.finished'
                  : isQuotePilot
                    ? 'quote.pilot.sent'
                    : 'quote.form.sent',
              )}
            </p>
          )}
          <div className="quote-actions">
            {step > 0 && !sent && !editingReview && (
              <button
                type="button"
                className="quote-back"
                disabled={checkingStep || isSubmitting || sending || downloading}
                onClick={() => goTo(step - 1)}
              >
                <EditorialArrow direction="left" /> {t('quote.form.back')}
              </button>
            )}
            {step === lastStep && (
              <ActionButton
                type="button"
                variant="secondary"
                onPress={download}
                isDisabled={downloading || sending}
              >
                <EditorialArrow direction="down" />
                {downloading ? t('quote.form.generating') : t('quote.form.download')}
              </ActionButton>
            )}
            {!sent && (
              <ActionButton
                type="submit"
                isDisabled={checkingStep || isSubmitting || downloading || sending}
              >
                {step === lastStep
                  ? sending
                    ? t('quote.form.sending')
                    : isIdeasPreview
                      ? t('quote.idea.finish')
                      : quoteEndpoint
                        ? t('quote.form.send')
                        : t('quote.form.compose')
                  : checkingStep
                    ? t('quote.calendar.checking')
                    : editingReview
                      ? t('quote.form.returnToReview')
                      : step === lastStep - 1
                        ? t('quote.form.review')
                        : t('quote.form.next')}{' '}
                <EditorialArrow />
              </ActionButton>
            )}
          </div>
          {step === lastStep && !sent && !isIdeasPreview && (
            <p>{quoteEndpoint ? t('quote.form.dataUse') : t('quote.form.emailHint')}</p>
          )}
          <p role="status" aria-live="polite">
            {notice && t(notice)}
          </p>
        </Suspense>
      </div>
    </form>
  )
}
