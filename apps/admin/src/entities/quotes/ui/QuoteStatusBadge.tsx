import { useI18n } from '@legado/brand/i18n'
import type { QuoteStatus } from '@legado/domain/quote/history'
import { quoteStatusCopy } from '../model/status-copy'
import './status.css'

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const { language } = useI18n()
  return (
    <span className="quote-status" data-quote-status={status}>
      {quoteStatusCopy[language][status]}
    </span>
  )
}
