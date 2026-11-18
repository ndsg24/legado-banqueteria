import { quoteCategories } from '../config/catalog'
import { napkinFoldLabels, layoutDetails, dinnerwareStyles, fabricColor, fabricTextures, floralDetails, fabricPartLabel } from '../config/table'
import { tableParts, type TableDesign } from '../types/table'
import { isSingleChoice, type Quantities } from './quantities'
import type { QuoteRequest } from './request'
import { selectedDishName, type SauceChoices } from './sauces'

export function displayDate(value: string) {
  if (!value) return 'Fecha por definir'
  return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
    .format(new Date(value + 'T12:00:00'))
}

export function eventDetails(quote: QuoteRequest) {
  return [['Tipo de evento', quote.event], ['Invitados', String(quote.guests)], ['Lugar', quote.location], ['Fecha', displayDate(quote.date)]]
}

export function contactDetails(quote: QuoteRequest) {
  return [['Nombre', quote.name], ['Correo electrónico', quote.email], ['Teléfono', quote.phone || 'Sin indicar']]
}

export function tableDetails(design: TableDesign) {
  return [
    ...layoutDetails(design), ['Vajilla', dinnerwareStyles[design.dinnerware].label],
    ['Plegado de servilleta', napkinFoldLabels[design.napkinFold]],
    ...floralDetails(design),
    ...tableParts.map(part => [fabricPartLabel(part, design), fabricColor(design[part]).label + ' · ' + fabricTextures.find(texture => texture.id === design.textures[part])!.label]),
  ]
}

export function menuGroups(items: Quantities, sauces?: SauceChoices) {
  return quoteCategories.map(category => ({
    name: category.label,
    entries: category.items.filter(item => items[item.id]).map(item => ({
      item, name: selectedDishName(item.id, item.name, sauces), quantity: isSingleChoice(item.id) ? '' : '× ' + items[item.id],
    })),
  })).filter(group => group.entries.length)
}
