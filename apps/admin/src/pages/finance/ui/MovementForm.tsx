import { useRef, useState, type FormEvent } from 'react'
import { useI18n } from '@legado/brand/i18n'
import { ActionButton, TextField, NativeSelect } from '@legado/brand/controls'
import { categories } from '@legado/domain/operations/finance'
import { operations } from '../../../shared/config/operations'
import { messages } from '../../../shared/config/messages'
import { localToday } from '../../../entities/quotes'

export function MovementForm({ quoteNumber, onSave }: { quoteNumber: string; onSave: () => void }) {
  const { language, t } = useI18n()
  const c = operations[language]
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const attempted = useRef({ serialized: '', id: '' })
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy) return
    const form = e.currentTarget
    const fields = new FormData(form)
    const payload = {
      date: fields.get('date'),
      category: fields.get('category'),
      amount: Number(fields.get('amount')),
      quoteNumber: fields.get('quoteNumber') || null,
    }
    const serialized = JSON.stringify(payload)
    if (attempted.current.serialized !== serialized)
      attempted.current = { serialized, id: crypto.randomUUID() }
    setBusy(true)
    setStatus('')
    try {
      const res = await fetch('/admin/api/v1/ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: attempted.current.id }),
      })
      if (res.status === 401) {
        location.replace(
          '/admin/login?next=' + encodeURIComponent(location.pathname + location.search),
        )
        return
      }
      if (res.status !== 204) {
        setStatus(res.status === 404 ? c.unknown : messages[language].serviceError)
        return
      }
      attempted.current = { serialized: '', id: '' }
      form.reset()
      setStatus(c.saved)
      onSave()
    } catch {
      setStatus(messages[language].serviceError)
    } finally {
      setBusy(false)
    }
  }
  return (
    <section className="admin-surface op-panel">
      <form className="ops-fields" onSubmit={submit}>
        <label>
          {c.category}
          <NativeSelect name="category">
            {categories.map((k) => (
              <option key={k} value={k}>
                {c[k]}
              </option>
            ))}
          </NativeSelect>
        </label>
        <TextField
          label={c.amount}
          name="amount"
          type="number"
          min="1"
          max="999999999"
          step="1"
          required
        />
        <TextField
          label={t('quote.review.date')}
          name="date"
          type="date"
          required
          defaultValue={localToday().toString()}
        />
        <TextField
          label={c.optional}
          name="quoteNumber"
          inputMode="numeric"
          pattern="[1-9][0-9]{0,17}"
          defaultValue={quoteNumber}
        />
        <ActionButton type="submit" isDisabled={busy}>
          {c.save}
        </ActionButton>
        <span role="status">{status}</span>
      </form>
    </section>
  )
}
