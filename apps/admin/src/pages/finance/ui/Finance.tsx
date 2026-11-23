import { MonthComparison } from './MonthComparison'
import { LedgerExport } from './LedgerExport'
import { financeLabels } from '../model/labels'
import { expenseColor } from '../model/expense-colors'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useLoaderData,
  useSearchParams,
  useRevalidator,
} from 'react-router'
import { useI18n } from '@legado/brand/i18n'
import { ActionButton, TextField, DialogCloseButton, NativeSelect } from '@legado/brand/controls'
import {
  categories,
  isIncome,
  type LedgerPage,
  type Category,
} from '@legado/domain/operations/finance'
import { operations } from '../../../shared/config/operations'
import { messages } from '../../../shared/config/messages'
import { PageHeading } from '../../../shared/ui/PageHeading'
import { ExpenseChart } from './ExpenseChart'
import { EmptyNotice } from '../../../shared/ui/EmptyNotice'
import { Pagination } from '../../../shared/ui/Pagination'
import { MovementForm } from './MovementForm'
import { displayDate } from '@legado/domain/quote/review'

export function Finance() {
  const data = useLoaderData<LedgerPage>()
  const { language, locale, t } = useI18n()
  const c = operations[language],
    copy = messages[language]
  const [params] = useSearchParams()
  const drawer = useRef<HTMLDialogElement>(null)
  const { hash, pathname, search } = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (hash === '#register' && !drawer.current?.open) drawer.current?.showModal()
  }, [hash])
  const [saved, setSaved] = useState(false)
  const { revalidate } = useRevalidator()
  const labels = financeLabels[language]
  const compare = hash === '#compare'
  const difference = data.sales - data.income
  const q = params.get('quoteNumber') || ''
  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(n)
  function apply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const next = new URLSearchParams()
    for (const [k, v] of new FormData(e.currentTarget)) if (String(v)) next.set(k, String(v))
    void navigate({ pathname, search: next.toString(), hash: compare ? '#compare' : '' })
  }
  return (
    <section className="ops-page finance-page">
      <PageHeading title={c.finance} titleInNavigation>
        {q && (
          <span>
            {copy.quote} #{q}
          </span>
        )}
        <ActionButton
          onPress={() => {
            setSaved(false)
            drawer.current?.showModal()
          }}
        >
          {c.register}
        </ActionButton>
      </PageHeading>
      <dialog
        ref={drawer}
        className="movement-drawer"
        aria-label={c.register}
        onClose={() => {
          if (hash === '#register') void navigate({ pathname, search }, { replace: true })
        }}
      >
        <header>
          <h2>{c.register}</h2>
          <DialogCloseButton label={c.close} onClose={() => drawer.current?.close()} />
        </header>
        <MovementForm
          key={q}
          quoteNumber={q}
          onSave={() => {
            drawer.current?.close()
            setSaved(true)
            void revalidate()
          }}
        />
      </dialog>
      {saved && <p role="status">{c.saved}</p>}
      <dl className="op-metrics">
        {(['profit', 'balance', 'income', 'expenses'] as const).map((k) => (
          <div
            key={k}
            className="admin-surface op-panel"
            data-pigment={
              {
                profit: data.profit < 0 ? 'wine' : 'herb',
                balance: 'blue',
                income: 'herb',
                expenses: 'citrus',
              }[k]
            }
          >
            <dt>{c[k]}</dt>
            <dd>{money(data[k])}</dd>
            {k === 'profit' && (
              <small>
                {c.resultHint} · {c.sales} {money(data.sales)}
              </small>
            )}
            {k === 'balance' && <small>{c.netHint}</small>}
          </div>
        ))}
      </dl>
      <form onSubmit={apply} className="ops-filters admin-surface" key={params.toString()}>
        <TextField
          label={c.month}
          name="month"
          type="month"
          defaultValue={params.get('month') || ''}
        />
        <TextField
          label={copy.quote}
          name="quoteNumber"
          inputMode="numeric"
          pattern="[1-9][0-9]{0,17}"
          defaultValue={q}
        />
        <label>
          {c.category}
          <NativeSelect name="category" defaultValue={params.get('category') || ''}>
            <option value="">{c.all}</option>
            {categories.map((k) => (
              <option value={k} key={k}>
                {c[k]}
              </option>
            ))}
          </NativeSelect>
        </label>
        <ActionButton variant="secondary" type="submit">
          {copy.apply}
        </ActionButton>
        {params.size > 0 && <Link to="/finance">{copy.clear}</Link>}
      </form>
      <nav className="ledger-tabs" aria-label={c.finance}>
        <Link to={{ pathname, search }} aria-current={!compare ? 'page' : undefined}>
          {labels.book}
        </Link>
        <Link
          to={{ pathname, search, hash: '#compare' }}
          aria-current={compare ? 'page' : undefined}
        >
          {labels.compare}
        </Link>
      </nav>
      {compare ? (
        <MonthComparison key={search} current={data} filters={search} />
      ) : (
        <>
          {q && !params.has('category') && !params.has('month') && data.total > 0 && (
            <section className="admin-surface settlement">
              <div>
                <h2>{labels.reconciliation}</h2>
                <p>{labels.scope}</p>
              </div>
              <dl>
                <div>
                  <dt>{c.sales}</dt>
                  <dd>{money(data.sales)}</dd>
                </div>
                <div>
                  <dt>{c.income}</dt>
                  <dd>{money(data.income)}</dd>
                </div>
                <div>
                  <dt>
                    {difference === 0
                      ? labels.reconciled
                      : difference > 0
                        ? labels.uncollected
                        : labels.advance}
                  </dt>
                  <dd>{money(Math.abs(difference))}</dd>
                </div>
              </dl>
            </section>
          )}
          <div className="op-columns">
            <section className="admin-surface op-panel">
              <header className="movement-heading">
                <h2>{c.movements}</h2>
                {data.total > 0 && <LedgerExport key={search} filters={search} />}
              </header>
              {data.items.length ? (
                <div className="op-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>{t('quote.review.date')}</th>
                        <th>{c.category}</th>
                        <th>{copy.quote}</th>
                        <th>{c.amount}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((row) => (
                        <tr
                          key={row.id}
                          data-flow={
                            row.category === 'sale'
                              ? 'sale'
                              : isIncome(row.category)
                                ? 'receipt'
                                : 'expense'
                          }
                        >
                          <td>{displayDate(row.date, locale, t)}</td>
                          <td>
                            <span className="movement-category">{c[row.category]}</span>
                          </td>
                          <td>
                            {row.quoteNumber ? (
                              <Link
                                to={
                                  row.quoteAvailable
                                    ? '/' + row.quoteNumber
                                    : '/finance?quoteNumber=' + row.quoteNumber
                                }
                              >
                                #{row.quoteNumber}
                              </Link>
                            ) : (
                              c.general
                            )}
                          </td>
                          <td>
                            {money(
                              row.category === 'sale' || isIncome(row.category)
                                ? row.amount
                                : -row.amount,
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyNotice icon="date">{c.empty}</EmptyNotice>
              )}
              {data.total > data.pageSize && (
                <Pagination page={data.page} pageSize={data.pageSize} total={data.total} />
              )}
            </section>
            {Object.keys(data.breakdown).length > 0 && (
              <aside className="op-stack">
                <section className="admin-surface op-panel">
                  <h2>{c.breakdown}</h2>
                  <ExpenseChart breakdown={data.breakdown} />
                  <dl className="op-lines">
                    {categories
                      .filter((k) => data.breakdown[k])
                      .map((k: Category) => (
                        <div key={k}>
                          <dt>
                            <Link
                              to={{
                                pathname,
                                search: new URLSearchParams({
                                  ...Object.fromEntries(params),
                                  category: k,
                                  page: '1',
                                }).toString(),
                              }}
                            >
                              {expenseColor(k) && (
                                <span
                                  aria-hidden="true"
                                  className="expense-swatch"
                                  style={{ backgroundColor: expenseColor(k) }}
                                />
                              )}
                              {c[k]}
                            </Link>
                          </dt>
                          <dd>{money(data.breakdown[k]!)}</dd>
                        </div>
                      ))}
                  </dl>
                </section>
              </aside>
            )}
          </div>
        </>
      )}
    </section>
  )
}
