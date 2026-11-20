import { type CatalogItem, menuSauces } from '../../../entities/menu'

export const emptySauceBowl: CatalogItem = {
  id: '',
  name: 'quote.sauce.none',
  description: 'quote.sauce.noneDescription',
  image: 'images/catalog/banquet/sin-salsa.webp',
  imageWidth: 320,
  imageHeight: 320,
  imageBounds: { x: 26, y: 38, width: 265, height: 252 },
}
export const sauceOptions = [emptySauceBowl, ...menuSauces]
