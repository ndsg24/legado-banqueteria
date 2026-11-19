import type { MessageKey } from '../../../shared/i18n'
import type { QuoteRequest } from '../../../entities/quote'

export const steps = [
  {
    label: 'quote.steps.event',
    icon: 'M4 5h16v15H4z M8 3v4m8-4v4M4 10h16m-12 4h2m4 0h2',
    title: 'quote.steps.eventTitle',
    fields: ['event', 'guests', 'location', 'date'],
  },
  {
    label: 'quote.steps.menu',
    icon: 'M4 15a8 8 0 0 1 16 0M2 16h20M4 20h16M12 5V3',
    title: 'quote.steps.menuTitle',
    fields: ['items', 'sauces'],
  },
  {
    label: 'quote.steps.table',
    icon: 'M3 11c0-4 18-4 18 0s-18 4-18 0Zm2 2-1 7m15-7 1 7M9 7V4h6v3',
    title: 'quote.steps.tableTitle',
    fields: ['table', 'notes'],
  },
  {
    label: 'quote.review.contact',
    icon: 'M3 5h18v14H3z M3 6l9 7 9-7',
    title: 'quote.steps.contactTitle',
    fields: ['name', 'email', 'phone'],
  },
  {
    label: 'quote.steps.review',
    icon: 'M6 3h9l4 4v14H6z M15 3v5h4M9 14l2 2 5-5',
    title: 'quote.steps.reviewTitle',
    fields: [],
  },
] satisfies { label: MessageKey; icon: string; title: MessageKey; fields: (keyof QuoteRequest)[] }[]
