import type { Language } from '@legado/brand/i18n'
import { messages } from '../../../shared/config/messages'
import { operations } from '../../../shared/config/operations'
import { workbench } from '../../../shared/config/workbench'

export function navigationSections(language: Language) {
  const copy = messages[language]
  const op = operations[language]
  const desk = workbench[language]
  return [
    {
      label: op.planning,
      items: [
        { path: '/', label: copy.dashboard, icon: 'dashboard' },
        { path: '/quotes', label: copy.history, icon: 'quotes' },
        { path: '/calendar', label: copy.calendar, icon: 'calendar' },
      ],
    },
    {
      label: op.operations,
      items: [
        { path: '/preparation', label: op.prep, icon: 'prep' },
        { path: '/purchasing', label: desk.purchasing, icon: 'shopping' },
        { path: '/recipes', label: desk.recipes, icon: 'recipes' },
        { path: '/finance', label: op.finance, icon: 'billing' },
        { path: '/content', label: copy.content, icon: 'content' },
      ],
    },
  ] as const
}
