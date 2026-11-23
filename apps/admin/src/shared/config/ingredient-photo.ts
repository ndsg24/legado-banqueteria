import { catalogCategories } from '@legado/domain/menu/catalog'
import { catalogPhoto } from './catalog-photo'
import type { MessageKey } from '@legado/domain/i18n/messages'

const photos = import.meta.glob<string>('../../../../web/public/images/ingredients/*.webp', {
  eager: true,
  query: '?url&no-inline',
  import: 'default',
})

const productImages = new Map(
  catalogCategories.flatMap(({ items }) =>
    items.map(({ name, imageThumbnail }) => [name, imageThumbnail]),
  ),
)

// Order follows the four columns and three rows of the generated reference image.
const atlasIngredients = [
  'bread',
  'sugar',
  'butter',
  'garlic',
  'salt',
  'mushroom',
  'salmon',
  'oil',
  'mascarpone',
  'stock',
  'onion',
]

export function ingredientAtlasPosition(name: MessageKey) {
  if (!name.startsWith('menu.ingredients.')) return
  const index = atlasIngredients.indexOf(name.slice('menu.ingredients.'.length))
  if (index < 0) return
  return ((index % 4) * 100) / 3 + '% ' + Math.floor(index / 4) * 50 + '%'
}

export function ingredientPhoto(name: MessageKey) {
  const prefix = 'menu.ingredients.'
  if (!name.startsWith(prefix)) return catalogPhoto(productImages.get(name))
  return photos['../../../../web/public/images/ingredients/' + name.slice(prefix.length) + '.webp']
}
