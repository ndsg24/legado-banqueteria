import { useMemo } from 'react'
import type { ApexOptions } from 'apexcharts'
import { useI18n } from '@legado/brand/i18n'
import { expenseCategories, type LedgerPage } from '@legado/domain/operations/finance'
import { operations } from '../../../shared/config/operations'
import { ApexChart } from '../../../shared/ui/ApexChart'
import { expenseColor } from '../model/expense-colors'
import './expense-chart.css'

export function ExpenseChart({ breakdown }: { breakdown: LedgerPage['breakdown'] }) {
  const { language, locale } = useI18n()
  const copy = operations[language]
  const { options, series } = useMemo(() => {
    const rows = expenseCategories.flatMap((category) => {
      const amount = breakdown[category]
      return amount ? [{ category, amount }] : []
    })
    const series = rows.map((row) => row.amount)
    const total = series.reduce((sum, amount) => sum + amount, 0)
    const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'CLP' })
    const compact = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'CLP',
      notation: 'compact',
      maximumFractionDigits: 1,
    })
    const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 })
    const options: ApexOptions = {
      labels: rows.map(({ category }) => copy[category]),
      colors: rows.map(({ category }) => expenseColor(category)),
      stroke: { width: rows.length > 1 ? 2 : 0, colors: ['var(--surface)'] },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: '76%',
            labels: {
              show: true,
              value: { fontSize: '18px', color: 'var(--ink)' },
              total: {
                show: true,
                showAlways: true,
                label: copy.expenses,
                fontSize: '12px',
                color: 'var(--muted)',
                formatter: () => compact.format(total),
              },
            },
          },
        },
      },
      tooltip: {
        y: {
          formatter: (amount) =>
            amount == null ? '—' : money.format(amount) + ' · ' + percent.format(amount / total),
        },
      },
    }
    return { options, series }
  }, [breakdown, copy, locale])
  if (!series.length) return null
  return (
    <figure className="expense-plot" aria-label={copy.expenses}>
      <ApexChart type="donut" options={options} series={series} height={192} />
    </figure>
  )
}
