import type { Language } from '@legado/brand/i18n'
import { messages } from '../../../shared/config/messages'
import { operations } from '../../../shared/config/operations'
import { workbench } from '../../../shared/config/workbench'

export function loginDestination(search: string, language: Language) {
  const next = new URLSearchParams(search).get('next')
  const fallback = { href: '/admin/', label: '' }
  if (!next) return fallback
  const path = next.split(/[?#]/, 1)[0].replace(/\/$/, '')
  const shared = messages[language]
  const work = workbench[language]
  const ops = operations[language]
  const paths = new Map([
    ['/admin', shared.dashboard],
    ['/admin/calendar', shared.calendar],
    ['/admin/content', shared.content],
    ['/admin/finance', ops.finance],
    ['/admin/purchasing', work.purchasing],
    ['/admin/recipes', work.recipes],
    ['/admin/preparation', ops.prep],
    ['/admin/quotes', shared.history],
  ])
  const detail = /^\/admin\/(preparation\/)?([1-9]\d{0,17})$/.exec(path)
  const label = detail ? `${detail[1] ? ops.prep : shared.quote} #${detail[2]}` : paths.get(path)
  return label ? { href: next, label } : fallback
}

export const loginHints = {
  es: { destination: 'Continuarás en', caps: 'Bloq Mayús está activo.' },
  en: { destination: 'You’ll return to', caps: 'Caps Lock is on.' },
  fr: { destination: 'Vous retrouverez', caps: 'Le verrouillage des majuscules est activé.' },
  pt: { destination: 'Você voltará para', caps: 'Caps Lock está ativado.' },
} satisfies Record<Language, { destination: string; caps: string }>
