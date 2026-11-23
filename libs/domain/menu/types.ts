import type { MessageKey } from '../i18n/messages'
export type IngredientKey = Extract<MessageKey, `menu.ingredients.${string}`>
export type CatalogCollection = 'cocktail' | 'banquet' | 'drinks'

export type CatalogItem = {
  id: string
  name: MessageKey
  description: MessageKey
  tastingNote?: Extract<MessageKey, `menu.dishes.${string}.tastingNote`>
  refreshment?: boolean
  ingredients?: readonly IngredientKey[]
  image: string
  imageThumbnail?: string
  imageSmall?: string
  imageSmallWidth?: number
  imageBounds: { x: number; y: number; width: number; height: number }
  imageWidth: number
  imageHeight: number
}

export type CatalogCategory = {
  id: string
  label: MessageKey
  collection: CatalogCollection
  items: readonly CatalogItem[]
}
