import { useState } from 'react'
import { useFetcher } from 'react-router'
import { ActionButton, NativeSelect } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { quoteStatuses, type QuoteStatus } from '@legado/domain/quote/history'
import { QuoteStatusBadge, quoteStatusCopy } from '../../../entities/quotes'
import { messages } from '../../../shared/config/messages'
import type { updateQuoteStatus } from '../model/status-action'

function StatusChoices({
  current,
  busy,
  dateBooked,
}: {
  current: QuoteStatus
  busy: boolean
  dateBooked: boolean
}) {
  const [value, setValue] = useState(current)
  const copy = quoteStatusCopy[useI18n().language]
  return (
    <>
      <NativeSelect
        aria-label={copy.status}
        name="status"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value as QuoteStatus)}
        disabled={busy}
        aria-describedby={dateBooked ? 'event-date-booked' : undefined}
      >
        {quoteStatuses.map((key) => (
          <option key={key} value={key} disabled={key === 'confirmed' && dateBooked}>
            {copy[key]}
          </option>
        ))}
      </NativeSelect>
      <ActionButton type="submit" isDisabled={busy || current === value}>
        {busy ? copy.saving : copy.save}
      </ActionButton>
    </>
  )
}

export function CommercialStatus({
  status,
  dateBooked,
}: {
  status: QuoteStatus
  dateBooked: boolean
}) {
  const { language } = useI18n()
  const text = quoteStatusCopy[language]
  const fetcher = useFetcher<typeof updateQuoteStatus>()
  const busy = fetcher.state !== 'idle'
  const result = busy ? undefined : fetcher.data?.result
  const failed = result === 'failed' || result === 'conflict' || result === 'booked'
  return (
    <section className="admin-surface commercial-status" data-quote-status={status}>
      <header>
        <h2>{text.followUp}</h2>
        <QuoteStatusBadge status={status} />
      </header>
      <fetcher.Form method="post">
        <input type="hidden" name="expectedStatus" value={status} />
        <StatusChoices
          key={status + String(dateBooked)}
          current={status}
          busy={busy}
          dateBooked={dateBooked}
        />
      </fetcher.Form>
      {dateBooked && (
        <p
          id="event-date-booked"
          className="status-response"
          role={result === 'booked' ? 'alert' : undefined}
        >
          {text.booked}
        </p>
      )}
      {result && !(result === 'booked' && dateBooked) && (
        <p className="status-response" role={failed ? 'alert' : 'status'}>
          {result === 'failed' ? messages[language].serviceError : text[result]}
        </p>
      )}
    </section>
  )
}
