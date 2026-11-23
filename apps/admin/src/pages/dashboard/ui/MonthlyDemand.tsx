import { EmptyNotice } from '../../../shared/ui/EmptyNotice'
import { useState } from 'react'
import { ApexChart } from '../../../shared/ui/ApexChart'
import { Link } from 'react-router'
import { useI18n } from '@legado/brand/i18n'
import type { ApiCalendarDay } from '@legado/domain/quote/wire'
import { monthStart } from '../../../entities/quotes'
import { messages } from '../../../shared/config/messages'

type MonthProps = { month: string; monthLabel: string; days: ApiCalendarDay[] }

function weeklyTotals({ month, days }: Pick<MonthProps, 'month' | 'days'>) {
  const first = monthStart(month)
  const last = first.add({ months: 1 }).subtract({ days: 1 }).day
  const sunday = 7 - ((first.toDate('UTC').getUTCDay() + 6) % 7)
  const weeks = []
  for (let start = 1; start <= last;) {
    const end = Math.min(last, start === 1 ? sunday : start + 6)
    const week = { range: start === end ? String(start) : start + '–' + end, count: 0, guests: 0 }
    for (const day of days) {
      const n = Number(day.date.slice(-2))
      if (n >= start && n <= end) {
        week.count += day.count
        week.guests += day.guests
      }
    }
    weeks.push(week)
    start = end + 1
  }
  return weeks
}

export function MonthlyDemand({ month, monthLabel, days }: MonthProps) {
  const { language, locale, t } = useI18n()
  const copy = messages[language]
  const [measure, setMeasure] = useState<'count' | 'guests'>('count')
  const labels = { count: copy.requests, guests: t('quote.review.guests') }
  const weeks = weeklyTotals({ month, days })
  const maxGuests = Math.max(0, ...weeks.map((week) => week.guests))
  const peakRanges = weeks.filter((week) => week.guests === maxGuests).map((week) => week.range)
  const numbers = new Intl.NumberFormat(locale)
  const values = weeks.map((week) => week[measure])
  const chartLabel = labels[measure] + ' · ' + monthLabel
  return (
    <section className="admin-surface dash-panel dash-demand" aria-labelledby="demand-heading">
      <header>
        <div>
          <h2 id="demand-heading">{copy.weeklyDemand}</h2>
          <p>{monthLabel}</p>
        </div>
        <div role="group" aria-label={copy.weeklyDemand} className="measure-switch">
          {(['count', 'guests'] as const).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={key === measure}
              onClick={() => setMeasure(key)}
            >
              {labels[key]}
            </button>
          ))}
        </div>
      </header>
      <figure className="demand-chart" aria-label={chartLabel}>
        <ApexChart
          type="bar"
          height="100%"
          series={[{ name: labels[measure], data: values }]}
          options={{
            chart: { accessibility: { description: chartLabel } },
            colors: [measure === 'count' ? 'var(--service-blue)' : 'var(--service-herb)'],
            plotOptions: {
              bar: {
                columnWidth: '46%',
                borderRadius: 4,
                borderRadiusApplication: 'end',
                dataLabels: { position: 'top' },
              },
            },
            dataLabels: {
              enabled: true,
              offsetY: -16,
              style: { colors: ['var(--ink)'], fontWeight: 600 },
              formatter: (value) => numbers.format(Number(value)),
            },
            xaxis: {
              categories: weeks.map((week) => week.range),
              axisTicks: { show: false },
              axisBorder: { show: false },
              labels: { rotate: 0, trim: false },
              tooltip: { enabled: false },
            },
            yaxis: { show: false, min: 0, max: Math.max(1, ...values) },
            grid: { strokeDashArray: 4, padding: { top: 14, left: 4, right: 4 } },
            tooltip: {
              y: { formatter: (value) => (value === null ? '—' : numbers.format(value)) },
            },
          }}
        />
      </figure>
      {maxGuests > 0 && (
        <p className="peak-week">
          <span>{copy.peakWeek}</span>
          <strong>
            {peakRanges.join(', ')} · {numbers.format(maxGuests)}{' '}
            {labels.guests.toLocaleLowerCase(locale)}
          </strong>
        </p>
      )}
    </section>
  )
}

export function PeakDates({ month, monthLabel, days }: MonthProps) {
  const { language, locale } = useI18n()
  const copy = messages[language]
  const ranked = [...days]
    .sort((a, b) => b.guests - a.guests || a.date.localeCompare(b.date))
    .slice(0, 5)
  const dateLabel = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
  return (
    <section className="admin-surface dash-panel dash-peaks" aria-labelledby="peak-heading">
      <header>
        <div>
          <h2 id="peak-heading">{copy.peakDays}</h2>
          <p>{monthLabel}</p>
        </div>
      </header>
      {ranked.length ? (
        <div className="peak-ranking">
          <ol className="peak-dates">
            {ranked.map((day) => (
              <li key={day.date}>
                <Link to={'/calendar?month=' + month + '&day=' + day.date}>
                  <time dateTime={day.date}>{dateLabel.format(new Date(day.date))}</time>
                  <strong>{day.guests.toLocaleString(locale)}</strong>
                </Link>
              </li>
            ))}
          </ol>
          <div className="peak-chart" aria-hidden="true" inert>
            <ApexChart
              type="bar"
              height="100%"
              series={[{ name: copy.peakDays, data: ranked.map((day) => day.guests) }]}
              options={{
                chart: { sparkline: { enabled: true }, accessibility: { enabled: false } },
                colors: ['var(--service-herb)'],
                plotOptions: {
                  bar: {
                    horizontal: true,
                    barHeight: '19%',
                    borderRadius: 4,
                    colors: { backgroundBarColors: ['var(--surface)'], backgroundBarRadius: 4 },
                  },
                },
                grid: { padding: { top: 0, bottom: 0, left: 0, right: 0 } },
                xaxis: { min: 0, max: Math.max(1, ranked[0].guests) },
                dataLabels: { enabled: false },
                tooltip: { enabled: false },
              }}
            />
          </div>
        </div>
      ) : (
        <EmptyNotice icon="guests">{copy.noDates}</EmptyNotice>
      )}
    </section>
  )
}
