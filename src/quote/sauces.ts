import { catalogCategories, menuSauces } from '../config/catalog'
import type { Quantities } from './quantities'

export type SauceChoices = Record<string, string>

const mainCourses = catalogCategories.find((category) => category.id === 'principales')!.items
export const mainCourseIds = new Set(mainCourses.map((item) => item.id))
const saucesById = new Map(menuSauces.map((item) => [item.id, item]))

export function selectedSauce(main: string, choices: SauceChoices) {
  return saucesById.get(choices[main])
}

export function isAllowedSauce(main: string, sauce: string) {
  return mainCourseIds.has(main) && saucesById.has(sauce)
}

export function readSauceChoices(params: URLSearchParams, items: Quantities): SauceChoices {
  const choices: SauceChoices = {}
  for (const pair of params.getAll('salsa')) {
    const [main, sauce] = pair.split(':')
    if (items[main] && isAllowedSauce(main, sauce)) choices[main] = sauce
  }
  return choices
}

export function writeSauceChoices(params: URLSearchParams, choices: SauceChoices) {
  params.delete('salsa')
  for (const [main, sauce] of Object.entries(choices)) params.append('salsa', main + ':' + sauce)
}

export function selectedDishName(id: string, name: string, choices?: SauceChoices) {
  const sauce = choices && selectedSauce(id, choices)?.name
  return sauce ? name + ' · ' + sauce : name
}
