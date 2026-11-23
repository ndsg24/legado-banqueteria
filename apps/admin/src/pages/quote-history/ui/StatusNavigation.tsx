import { Link, useSearchParams } from 'react-router'
import { useI18n } from '@legado/brand/i18n'
import { quoteStatusCopy } from '../../../entities/quotes'
import { quoteStatuses } from '@legado/domain/quote/history'

export function StatusNavigation() {
  const [params] = useSearchParams()
  const current = params.get('status') || 'all'
  const copy = quoteStatusCopy[useI18n().language]
  const filters =
    current === 'active'
      ? (['all', 'active', ...quoteStatuses] as const)
      : (['all', ...quoteStatuses] as const)
  return (
    <nav className="sales-index" aria-label={copy.status}>
      {filters.map((key) => {
        const next = new URLSearchParams(params)
        next.delete('page')
        next.delete('before')
        if (key === 'all') next.delete('status')
        else next.set('status', key)
        const label =
          key === 'confirmed'
            ? copy.confirmedPlural
            : key === 'cancelled'
              ? copy.cancelledPlural
              : copy[key]
        return (
          <Link
            key={key}
            data-quote-status={key}
            to={{ search: next.toString() }}
            aria-current={key === current ? 'page' : undefined}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
