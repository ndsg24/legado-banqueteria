import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@legado/brand/i18n'
import { ActionButton } from '@legado/brand/controls'
import { type LedgerPage, isIncome } from '@legado/domain/operations/finance'
import { downloadCsv } from '../../../shared/lib'
import { readAdminApi } from '../../../shared/api'
import { operations } from '../../../shared/config/operations'
import { messages } from '../../../shared/config/messages'
import { financeLabels } from '../model/labels'

export function LedgerExport({ filters }: { filters: string }) {
  const { language, t } = useI18n()
  const c = operations[language]
  const copy = financeLabels[language]
  const [status, setStatus] = useState<'idle' | 'busy' | 'changed' | 'error'>('idle')
  const controller = useRef<AbortController | null>(null)
  useEffect(() => () => controller.current?.abort(), [])
  async function start() {
    if (controller.current) return
    setStatus('busy')
    const run = new AbortController()
    controller.current = run
    const params = new URLSearchParams(filters)
    const movements: LedgerPage['items'] = []
    const ids = new Set<string>()
    let expected: number | undefined
    try {
      for (let page = 1; ; page++) {
        params.set('page', String(page))
        const batch: LedgerPage = await readAdminApi('ledger?' + params, run.signal)
        expected ??= batch.total
        if (
          batch.total !== expected ||
          batch.page !== page ||
          batch.items.some((row) => ids.has(row.id))
        ) {
          setStatus('changed')
          return
        }
        for (const row of batch.items) {
          ids.add(row.id)
          movements.push(row)
        }
        if (movements.length === expected) break
        if (!batch.items.length || movements.length > expected) {
          setStatus('changed')
          return
        }
      }
      if (run.signal.aborted) return
      downloadCsv(
        'legado-finanzas' + (params.has('month') ? '-' + params.get('month') : '') + '.csv',
        [
          [t('quote.review.date'), c.category, messages[language].quote, c.amount],
          ...movements.map((row) => [
            row.date,
            c[row.category],
            row.quoteNumber ?? '',
            isIncome(row.category) || row.category === 'sale' ? row.amount : -row.amount,
          ]),
        ],
      )
      setStatus('idle')
    } catch {
      if (!run.signal.aborted) setStatus('error')
    } finally {
      controller.current = null
    }
  }
  return (
    <div className="ledger-export">
      <ActionButton variant="secondary" isDisabled={status === 'busy'} onPress={() => void start()}>
        {status === 'busy'
          ? copy.preparing
          : status === 'error'
            ? copy.downloadError
            : copy.statement}
      </ActionButton>
      {(status === 'error' || status === 'changed') && <span role="alert">{copy[status]}</span>}
    </div>
  )
}
