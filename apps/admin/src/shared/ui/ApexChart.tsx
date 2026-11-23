import { lazy, Suspense, useSyncExternalStore } from 'react'
import type { ApexOptions } from 'apexcharts'
import { useI18n } from '@legado/brand/i18n'
import en from 'apexcharts/dist/locales/en.json'
import es from 'apexcharts/dist/locales/es.json'
import fr from 'apexcharts/dist/locales/fr.json'
import pt from 'apexcharts/dist/locales/pt-br.json'
import 'apexcharts/dist/apexcharts.css'
import './apex-chart.css'

function loadChart(register: () => Promise<unknown>) {
  return lazy(async () => {
    const [renderer] = await Promise.all([import('./apex-renderer'), register()])
    return renderer
  })
}

const renderers = {
  bar: loadChart(() => import('apexcharts/bar')),
  donut: loadChart(() => import('apexcharts/pie')),
}
const locales = [en, es, fr, pt]

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

function readTheme() {
  return document.documentElement.dataset.theme
}

type Props = {
  type: keyof typeof renderers
  series: NonNullable<ApexOptions['series']>
  options: ApexOptions
  height: number | string
}

export function ApexChart({ type, series, options, height }: Props) {
  const { language } = useI18n()
  const theme = useSyncExternalStore(subscribeToTheme, readTheme)
  const styles = getComputedStyle(document.documentElement)
  const token = (name: string) => styles.getPropertyValue(name).trim()
  const colors = (options.colors ?? ['var(--gold)']).map((color) => {
    if (typeof color !== 'string' || !color.startsWith('var(')) return color
    return token(color.slice(4, -1))
  })
  const Chart = renderers[type]
  const chartOptions: ApexOptions = {
    ...options,
    colors,
    chart: {
      animations: { enabled: false },
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0,
      injectStyleSheet: false,
      foreColor: token('--muted'),
      fontFamily: token('--sans'),
      locales,
      defaultLocale: language === 'pt' ? pt.name : language,
      ...options.chart,
    },
    fill: { opacity: 1, ...options.fill },
    grid: { borderColor: token('--line'), ...options.grid },
    legend: { show: false, ...options.legend },
    tooltip: {
      theme: theme === 'dark' || theme === 'garden' ? 'dark' : 'light',
      ...options.tooltip,
    },
  }
  return (
    <Suspense fallback={<div className="apex-placeholder" aria-hidden="true" style={{ height }} />}>
      <Chart
        key={language}
        className="admin-apex-chart"
        type={type}
        options={chartOptions}
        series={series}
        height={height}
        style={{ height }}
      />
    </Suspense>
  )
}
