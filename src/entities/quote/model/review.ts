import { spanish, type Translate } from '../../../shared/i18n'
import {
  quoteCategories,
  isSingleChoice,
  type Quantities,
  selectedDishName,
  type SauceChoices,
} from '../../menu/@x/quote'
import {
  napkinFoldLabels,
  layoutDetails,
  dinnerwareStyles,
  fabricColor,
  fabricTextures,
  floralDetails,
  fabricPartLabel,
  tableParts,
  type TableDesign,
} from '../../table/@x/quote'
import { eventLabels, type QuoteRequest } from './request'

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

export function tableDetails(design: TableDesign, t: Translate) {
  return [
    ...layoutDetails(design, t),
    [t('quote.review.dinnerware'), t(dinnerwareStyles[design.dinnerware].label)],
    [t('quote.review.napkinFold'), t(napkinFoldLabels[design.napkinFold])],
    ...floralDetails(design, t),
    ...tableParts.map((part) => [
      t(fabricPartLabel(part, design)),
      t(fabricColor(design[part]).label) +
        ' · ' +
        t(fabricTextures.find((texture) => texture.id === design.textures[part])!.label),
    ]),
  ]
}

export function menuGroups(items: Quantities, sauces: SauceChoices | undefined, t: Translate) {
  return quoteCategories
    .map((category) => ({
      name: t(category.label),
      entries: category.items
        .filter((item) => items[item.id])
        .map((item) => ({
          item,
          name: selectedDishName(item.id, item.name, sauces, t),
          quantity: isSingleChoice(item.id) ? '' : '× ' + items[item.id],
        })),
    }))
    .filter((group) => group.entries.length)
}
