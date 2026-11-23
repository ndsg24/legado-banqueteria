import { Link, useLoaderData } from 'react-router'
import { DetailIcon } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { workbench } from '../../../shared/config/workbench'
import { Agenda, quoteStatusCopy } from '../../../entities/quotes'
import { operations } from '../../../shared/config/operations'
import { messages } from '../../../shared/config/messages'
import { MonthlyDemand, PeakDates } from './MonthlyDemand'
import { expenseCategories } from '@legado/domain/operations/finance'
import { ServicePlanner } from './ServicePlanner'
import { ServiceCover } from './ServiceCover'
import './dashboard.css'

import type { loadDashboard } from '../model/loader'
export function Dashboard() {
  return <DashboardView data={useLoaderData<typeof loadDashboard>()} />
}

export function DashboardView({ data }: { data: Awaited<ReturnType<typeof loadDashboard>> }) {
  const { language, locale } = useI18n()
  const c = operations[language]
  const money = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  })
  const largestExpense = expenseCategories
    .filter((key) => (data.ledger.breakdown[key] ?? 0) > 0)
    .sort((a, b) => data.ledger.breakdown[b]! - data.ledger.breakdown[a]!)[0]
  const copy = messages[language]
  const bench = workbench[language],
    states = quoteStatusCopy[language]
  const month = data.today.slice(0, 7)
  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(data.today))
  return (
    <section className="dashboard">
      <h1 className="admin-visually-hidden">{copy.dashboard}</h1>
      <div className="dash-opening">
        <ServiceCover next={data.upcoming[0]} today={data.today} />
        <dl className="dash-metrics">
          {(
            [
              ['wine', copy.retained, data.total, '/quotes', <DetailIcon kind="email" />],
              ['blue', copy.thisMonth, data.events, '/calendar', <DetailIcon kind="location" />],
              ['herb', copy.monthGuests, data.guests, '/calendar', <DetailIcon kind="guests" />],
              [
                'citrus',
                copy.requestedDays,
                data.days.length,
                '/calendar',
                <DetailIcon kind="date" />,
              ],
            ] as const
          ).map(([pigment, label, value, to, icon]) => (
            <div key={label} className="admin-surface dash-tile" data-pigment={pigment}>
              <dt>
                <Link to={to}>
                  <span className="metric-seal">{icon}</span>
                  <span>{label}</span>
                </Link>
              </dt>
              <dd className="dashboard-figure">{value.toLocaleString(locale)}</dd>
            </div>
          ))}
        </dl>
      </div>
      <nav className="service-handoff admin-surface" aria-labelledby="handoff-heading">
        <h2 id="handoff-heading">{bench.overview}</h2>
        <div className="handoff-states">
          <Link to="/quotes?status=requested" data-pigment="citrus">
            <strong className="dashboard-figure">{data.pending.toLocaleString(locale)}</strong>
            <span>{states.requested}</span>
          </Link>
          <Link to="/quotes?status=confirmed" data-pigment="herb">
            <strong className="dashboard-figure">{data.confirmed.toLocaleString(locale)}</strong>
            <span>{states.confirmedPlural}</span>
          </Link>
        </div>
        <Link className="handoff-purchasing" to="/purchasing">
          {bench.purchasing}
        </Link>
      </nav>
      <div className="dash-lead">
        <ServicePlanner today={data.today} activity={data.planningDays} />
        <section
          className="dash-balance admin-surface"
          data-pigment={data.ledger.profit < 0 ? 'wine' : 'herb'}
        >
          <header>
            <h2>{c.finance}</h2>
            <span>{monthLabel}</span>
          </header>
          <div className="balance-result">
            <span>{c.profit}</span>
            <strong className="dashboard-figure">{money.format(data.ledger.profit)}</strong>
          </div>
          <dl>
            {(['income', 'expenses'] as const).map((k) => (
              <div key={k}>
                <dt>{c[k]}</dt>
                <dd>{money.format(data.ledger[k])}</dd>
              </div>
            ))}
          </dl>
          {largestExpense && (
            <Link
              className="expense-insight"
              to={'/finance?month=' + month + '&category=' + largestExpense}
            >
              <span>{copy.largestExpense}</span>
              <strong>
                {c[largestExpense]} · {money.format(data.ledger.breakdown[largestExpense]!)}
              </strong>
            </Link>
          )}
          <div className="balance-actions">
            <Link to={'/finance?month=' + month + '#register'}>{c.register}</Link>
            {data.ledger.total > 0 && <Link to={'/finance?month=' + month}>{c.movements}</Link>}
          </div>
        </section>
      </div>

      <div className="dash-grid">
        <MonthlyDemand month={month} monthLabel={monthLabel} days={data.days} />
        <PeakDates month={month} monthLabel={monthLabel} days={data.days} />
      </div>
      <section className="admin-surface dash-agenda dash-panel">
        <header>
          <h2>{copy.upcoming}</h2>
          <Link to="/calendar">{copy.calendar}</Link>
        </header>
        <Agenda rows={data.upcoming} />
      </section>
    </section>
  )
}
