import { useEffect, useState } from 'react'
import { useI18n } from '@legado/brand/i18n'
import { ActionButton, TextField } from '@legado/brand/controls'
import type { LedgerPage } from '@legado/domain/operations/finance'
import { monthStart, localToday } from '../../../entities/quotes'
import { readAdminApi } from '../../../shared/api'
import { operations } from '../../../shared/config/operations'
import { messages } from '../../../shared/config/messages'
import { financeLabels } from '../model/labels'

type Comparison = [LedgerPage, LedgerPage]
export function MonthComparison({ filters, current }: { filters: string; current: LedgerPage }) {
  const { language, locale } = useI18n()
  const c = operations[language]
  const copy = financeLabels[language]
  const params = new URLSearchParams(filters)
  const [month, setMonth] = useState(params.get('month') || localToday().toString().slice(0, 7))
  const [retry, setRetry] = useState(0)
  const start = monthStart(month)
  const previous = start.subtract({ months: 1 }).toString().slice(0, 7)
  params.delete('page')
  params.delete('month')
  const scope = params.toString()
  const key = [scope, month, retry].join('/')
  const [result, setResult] = useState<{ key: string; pair?: Comparison }>()
  useEffect(() => {
    if (!month) return
    const controller = new AbortController()
    const read = (value: string) => {
      const query = new URLSearchParams(scope)
      query.set('month', value)
      return readAdminApi('ledger?' + query, controller.signal) as Promise<LedgerPage>
    }
    Promise.all([read(previous), read(month)])
      .then((pair) => {
        if (!controller.signal.aborted) setResult({ key, pair })
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ key })
      })
    return () => controller.abort()
  }, [month, previous, scope, key, current])
  const formatMonth = new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const money = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  })
  const pair = result?.key === key ? result.pair : undefined
  return (
    <section className="admin-surface op-panel month-comparison">
      <header>
        <h2>{copy.compare}</h2>
        <TextField
          label={copy.target}
          type="month"
          value={month}
          min="1001-01"
          max="9999-12"
          onChange={(e) => setMonth(e.target.value)}
        />
      </header>
      {month &&
        (pair ? (
          <>
            <div className="op-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">{c.category}</th>
                    {[previous, month].map((m) => (
                      <th scope="col" key={m}>
                        {formatMonth.format(monthStart(m).toDate('UTC'))}
                      </th>
                    ))}
                    <th scope="col">{copy.delta}</th>
                  </tr>
                </thead>
                <tbody>
                  {(['sales', 'income', 'expenses', 'profit', 'balance'] as const).map((k) => {
                    const diff = pair[1][k] - pair[0][k]
                    return (
                      <tr key={k}>
                        <th scope="row">{c[k]}</th>
                        {pair.map((period, i) => (
                          <td key={i}>{money.format(period[k])}</td>
                        ))}
                        <td
                          data-direction={
                            diff === 0
                              ? 'same'
                              : (k === 'expenses' ? diff < 0 : diff > 0)
                                ? 'up'
                                : 'down'
                          }
                        >
                          {diff > 0 ? '+' : ''}
                          {money.format(diff)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {!pair[0].total && !pair[1].total && <p>{copy.noActivity}</p>}
          </>
        ) : result?.key !== key ? (
          <p role="status">{copy.comparing}</p>
        ) : (
          <div role="alert">
            <p>{messages[language].serviceError}</p>
            <ActionButton variant="secondary" onPress={() => setRetry((n) => n + 1)}>
              {messages[language].retry}
            </ActionButton>
          </div>
        ))}
    </section>
  )
}
