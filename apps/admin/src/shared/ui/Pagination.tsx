import { NativeSelect } from '@legado/brand/controls'
import { Link, useSearchParams } from 'react-router'
import { useI18n } from '@legado/brand/i18n'
import { messages } from '../config/messages'
import './pagination.css'

export function Pagination({
  page,
  pageSize,
  total,
  allowResize = false,
}: {
  page: number
  pageSize: number
  total: number
  allowResize?: boolean
}) {
  const [params, setParams] = useSearchParams()
  const copy = messages[useI18n().language]
  const pages = Math.max(1, Math.ceil(total / pageSize))
  function query(n: number, size = pageSize) {
    const out = new URLSearchParams(params)
    out.delete('before')
    out.set('page', String(n))
    if (allowResize) out.set('pageSize', String(size))
    return out
  }
  const visible = [...new Set([1, page - 1, page, page + 1, pages])]
    .filter((n) => n >= 1 && n <= pages)
    .sort((a, b) => a - b)
  return (
    <nav className="pager" aria-label={copy.page}>
      <span>
        {total ? (page - 1) * pageSize + 1 : 0}–{Math.min(total, page * pageSize)} / {total}
      </span>
      {allowResize && (
        <label>
          {copy.perPage}{' '}
          <NativeSelect
            value={pageSize}
            onChange={(e) => setParams(query(1, Number(e.target.value)))}
          >
            {[...new Set([5, 10, 25, pageSize])]
              .sort((a, b) => a - b)
              .map((n) => (
                <option key={n}>{n}</option>
              ))}
          </NativeSelect>
        </label>
      )}
      <div className="pager-links">
        {page > 1 ? (
          <Link to={'?' + query(page - 1)} aria-label={copy.previous}>
            ‹
          </Link>
        ) : (
          <button disabled aria-label={copy.previous}>
            ‹
          </button>
        )}
        {visible.map((n, i) => (
          <span key={n}>
            {i > 0 && visible[i - 1] < n - 1 && <i>…</i>}
            <Link
              aria-label={copy.page + ' ' + n}
              aria-current={page === n ? 'page' : undefined}
              to={'?' + query(n)}
            >
              {n}
            </Link>
          </span>
        ))}
        {page < pages ? (
          <Link to={'?' + query(page + 1)} aria-label={copy.next}>
            ›
          </Link>
        ) : (
          <button disabled aria-label={copy.next}>
            ›
          </button>
        )}
      </div>
    </nav>
  )
}
