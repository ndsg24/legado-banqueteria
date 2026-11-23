import { spanish, type Translate } from '../i18n/messages'
import {
  quoteMenuServices,
  menuItems,
  isSingleChoice,
  omissionLabel,
  selectedDishName,
  selectedSauce,
} from '../menu/for-quote'
import {
  napkinFoldLabels,
  layoutDetails,
  dinnerwareStyles,
  fabricColor,
  fabricTextures,
  floralEntries,
  fabricPartLabel,
  tableParts,
  type TableDesign,
} from '../table/for-quote'
import { dietaryGroups, eventLabels, type DietaryOption, type QuoteRequest } from './request'

export function dietaryMenuGroups(quote: QuoteRequest, t: Translate) {
  const legacy = new Set<DietaryOption>(quote.allergens)
  return dietaryGroups
    .map((group) => ({
      name: t(`quote.dietary.group.${group.id}`),
      entries: group.options.flatMap((id) => {
        const count = quote.dietaryCounts?.[id]
        if (!count && !legacy.has(id)) return []
        const quantity = count
          ? t(count === 1 ? 'quote.dietary.onePerson' : 'quote.dietary.peopleCount', { count })
          : ''
        return [{ id, name: t(`quote.allergen.${id}`), quantity }]
      }),
    }))
    .filter((group) => group.entries.length)
}

export function dietaryDetails(quote: QuoteRequest, t: Translate) {
  const entries = dietaryMenuGroups(quote, t).flatMap((group) => group.entries)
  const ingredients = entries
    .filter((entry) => !entry.quantity)
    .map((entry) => entry.name)
    .join(', ')
  const counts = entries
    .filter((entry) => entry.quantity)
    .map((entry) => entry.name + ' · ' + entry.quantity)
  return [ingredients, ...counts, quote.dietaryNeeds].filter(Boolean).join('\n')
}

export function displayDate(value: string, locale = 'es-CL', t: Translate = spanish) {
  if (!value) return t('quote.review.unknownDate')
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value + 'T12:00:00'))
}

export function eventDetails(quote: QuoteRequest, locale: string, t: Translate) {
  return [
    [t('quote.review.eventType'), t(eventLabels[quote.event])],
    [t('quote.review.guests'), String(quote.guests)],
    [t('quote.review.venue'), quote.location],
    [t('quote.review.date'), displayDate(quote.date, locale, t)],
  ]
}

export function contactDetails(quote: QuoteRequest, t: Translate) {
  return [
    [t('quote.review.name'), quote.name],
    [t('quote.review.email'), quote.email],
    [t('quote.review.phone'), quote.phone || t('quote.review.unspecified')],
  ]
}

export function settingEntries(design: TableDesign, t: Translate) {
  return [
    {
      key: 'dinnerware' as const,
      label: t('quote.review.dinnerware'),
      value: t(dinnerwareStyles[design.dinnerware].label),
    },
    {
      key: 'napkinFold' as const,
      label: t('quote.review.napkinFold'),
      value: t(napkinFoldLabels[design.napkinFold]),
    },
    ...floralEntries(design, t),
    ...tableParts.map((part) => ({
      key: part,
      label: t(fabricPartLabel(part, design)),
      value:
        t(fabricColor(design[part]).label) +
        ' · ' +
        t(fabricTextures.find((texture) => texture.id === design.textures[part])!.label),
    })),
  ]
}
export function settingDetails(design: TableDesign, t: Translate) {
  return settingEntries(design, t).map(({ label, value }) => [label, value])
}

export function tableDetails(design: TableDesign, t: Translate) {
  return [...layoutDetails(design, t), ...settingDetails(design, t)]
}

export function menuGroups(
  {
    items,
    sauces,
    omittedIngredients,
  }: Pick<QuoteRequest, 'items' | 'sauces' | 'omittedIngredients'>,
  t: Translate,
) {
  return quoteMenuServices
    .map((section) => ({
      id: section.id,
      motif: section.motif,
      name: t(section.label),
      groups: section.groups
        .map((group) => ({
          categoryId: group.categories[0].id,
          name: group.label === section.label ? null : t(group.label),
          entries: group.categories
            .flatMap((category) => category.items)
            .filter((item) => items[item.id])
            .map((item) => {
              const sauce = sauces && selectedSauce(item.id, sauces)
              return {
                item,
                name: t(item.name),
                omissions: omissionLabel(item.id, omittedIngredients, t),
                sauce: sauce && { item: sauce, name: t(sauce.name) },
                quantity: isSingleChoice(item.id) ? '' : '× ' + items[item.id],
              }
            }),
        }))
        .filter((group) => group.entries.length),
    }))
    .filter((section) => section.groups.length)
}

export function quoteMessage(data: QuoteRequest, t: Translate = spanish) {
  const lines = [
    t('quote.review.documentTitle'),
    '',
    t('quote.review.name') + ': ' + data.name,
    t('quote.review.emailShort') + ': ' + data.email,
    t('quote.review.phone') + ': ' + (data.phone || t('quote.review.unspecified')),
    t('quote.steps.event') + ': ' + t(eventLabels[data.event]),
    t('quote.review.date') + ': ' + data.date,
    t('quote.review.guests') + ': ' + data.guests,
    t('quote.review.venue') + ': ' + data.location,
    '',
    t('quote.steps.menu') +
      ': ' +
      (Object.entries(data.items)
        .map(([id, quantity]) => {
          const dish = isSingleChoice(id)
            ? selectedDishName(id, menuItems.get(id)!, data.sauces, t)
            : quantity + ' × ' + t(menuItems.get(id)!)
          const note = omissionLabel(id, data.omittedIngredients, t)
          return note ? dish + ' (' + note + ')' : dish
        })
        .join(', ') || t('quote.review.consultTeam')),
  ]
  const dietary = dietaryDetails(data, t)
  if (dietary) lines.push('', t('quote.review.dietaryNeeds'), dietary)
  const table = data.table
  if (table) {
    lines.push(
      '',
      t('quote.review.setting'),
      ...tableDetails(table, t).map(([label, value]) => label + ': ' + value),
    )
  }
  if (data.notes) lines.push('', t('quote.review.comments') + ': ' + data.notes)
  return lines.join('\n')
}
