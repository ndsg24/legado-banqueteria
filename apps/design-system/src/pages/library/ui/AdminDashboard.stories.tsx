import type { Meta, StoryObj } from '@storybook/react-vite'
import { useGlobals } from 'storybook/preview-api'
import { ThemeToggle } from '@legado/brand/controls'
import { isTheme } from '@legado/brand/theme'
import { summarizeLedger } from '@legado/domain/operations/finance'
import type { ApiCalendarDay, ApiSummary } from '@legado/domain/quote/wire'
import { DashboardView } from '../../../../../admin/src/pages/dashboard/ui/Dashboard'
import { Navigation } from '../../../../../admin/src/widgets/navigation'

const upcoming: ApiSummary[] = [
  {
    number: '1048',
    event: 'wedding',
    status: 'confirmed',
    date: '2026-11-28',
    location: 'Concepción',
    guests: '120',
  },
  {
    number: '1052',
    event: 'corporate-event',
    status: 'requested',
    date: '2026-11-30',
    location: 'San Pedro de la Paz',
    guests: '72',
  },
  {
    number: '1053',
    event: 'family-gathering',
    status: 'requested',
    date: '2026-12-05',
    location: 'Chiguayante',
    guests: '56',
  },
]
const days: ApiCalendarDay[] = [
  { date: '2026-11-07', count: 2, guests: 120, event: 'family-gathering' },
  { date: '2026-11-12', count: 4, guests: 310, event: 'corporate-event' },
  { date: '2026-11-18', count: 2, guests: 185, event: 'wedding' },
  { date: '2026-11-28', count: 1, guests: 120, event: 'wedding' },
  { date: '2026-11-30', count: 2, guests: 140, event: 'corporate-event' },
]
const breakdown = { sale: 6480000, payment: 6480000, staff: 1120000, supplies: 1910000 }
const ledger = {
  ...summarizeLedger(breakdown),
  breakdown,
  items: [],
  total: 12,
  page: 1,
  pageSize: 10,
}
const data = {
  today: '2026-11-22',
  ledger,
  days,
  planningDays: [
    ...days,
    { date: '2026-12-05', count: 1, guests: 56, event: 'family-gathering' as const },
  ],
  upcoming,
  total: 42,
  pending: 8,
  confirmed: 5,
  events: days.reduce((sum, day) => sum + day.count, 0),
  guests: days.reduce((sum, day) => sum + day.guests, 0),
}

const meta = {
  title: 'Páginas/Panel administrativo/Resumen',
  parameters: { layout: 'fullscreen', interface: 'admin' },
} satisfies Meta
export default meta

type Story = StoryObj<typeof meta>

export const ConEventos: Story = {
  render: function Dashboard() {
    const [globals, updateGlobals] = useGlobals()
    return (
      <Navigation
        dashboardDate={data.today}
        profile={{ displayName: 'Equipo demo', email: 'operaciones@example.test' }}
        preferences={
          <ThemeToggle
            theme={isTheme(globals.theme) ? globals.theme : 'light'}
            onChange={(theme) => updateGlobals({ theme })}
          />
        }
      >
        <main id="admin-content" tabIndex={-1}>
          <DashboardView data={data} />
        </main>
      </Navigation>
    )
  },
}

export const SinEventosProximos: Story = {
  render: () => (
    <div className="workspace">
      <main>
        <DashboardView data={{ ...data, upcoming: [] }} />
      </main>
    </div>
  ),
}
