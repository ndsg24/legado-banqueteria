import type { MessageKey } from '../../../shared/i18n'
import { quoteCategories } from './catalog'
import type { CatalogCategory } from './types'

function asGroup(category: CatalogCategory) {
  return { label: category.label, categories: [category] }
}

const banquetCategories = quoteCategories.filter(
  (category) => category.collection !== 'cocktail' && category.id !== 'bar',
)
const banquetCourses: { label: MessageKey; categories: string[] }[] = [
  { label: 'quote.course.aperitif', categories: ['aperitivos'] },
  { label: 'quote.course.starter', categories: ['entradas'] },
  { label: 'quote.course.main', categories: ['principales', 'guarniciones'] },
  { label: 'quote.course.dessert', categories: ['postres'] },
  { label: 'quote.course.digestif', categories: ['bajativos'] },
]

export const quoteMenuServices = [
  {
    id: 'cocktail',
    motif: 'extras',
    label: 'catalog.collections.cocktail',
    groups: quoteCategories.filter((category) => category.collection === 'cocktail').map(asGroup),
  },
  {
    id: 'banquet',
    motif: 'principales',
    label: 'quote.review.banquetMenu',
    groups: [
      ...banquetCourses.map((course) => ({
        label: course.label,
        categories: banquetCategories.filter((category) => course.categories.includes(category.id)),
      })),
      ...banquetCategories
        .filter(
          (category) => !banquetCourses.some((course) => course.categories.includes(category.id)),
        )
        .map(asGroup),
    ],
  },
  {
    id: 'bar',
    motif: 'bar',
    label: 'menu.categories.bar',
    groups: quoteCategories.filter((category) => category.id === 'bar').map(asGroup),
  },
] as const
