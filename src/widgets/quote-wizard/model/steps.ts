import type { MessageKey } from '../../../shared/i18n'
import type { QuoteRequest } from '../../../entities/quote'

export const steps = [
  {
    id: 'event' as const,
    label: 'quote.steps.event',
    title: 'quote.steps.eventTitle',
    fields: ['event', 'guests', 'location', 'date'],
  },
  {
    id: 'menu' as const,
    label: 'quote.steps.menu',
    title: 'quote.steps.menuTitle',
    fields: ['items', 'sauces', 'omittedIngredients'],
  },
  {
    id: 'dietary' as const,
    label: 'quote.steps.dietary',
    title: 'quote.steps.dietaryTitle',
    fields: ['dietaryCounts', 'dietaryNeeds', 'notes'],
  },
  {
    id: 'table' as const,
    label: 'quote.steps.table',
    title: 'quote.steps.tableTitle',
    fields: ['table'],
  },
  {
    id: 'contact' as const,
    label: 'quote.review.contact',
    title: 'quote.steps.contactTitle',
    fields: ['name', 'email', 'phone'],
  },
  {
    id: 'review' as const,
    label: 'quote.steps.review',
    title: 'quote.steps.reviewTitle',
    fields: [],
  },
] satisfies {
  id: string
  label: MessageKey
  title: MessageKey
  fields: (keyof QuoteRequest)[]
}[]

export type StepId = (typeof steps)[number]['id']
