export type CatalogCollection = 'cocktail' | 'banquet' | 'drinks'

export type CatalogItem = {
  id: string
  name: string
  description: string
  image: string
  imageSmall?: string
  imageSmallWidth?: number
  imageBounds: { x: number; y: number; width: number; height: number }
  imageWidth: number
  imageHeight: number
  price?: number
}

export type CatalogCategory = {
  id: string
  label: string
  collection: CatalogCollection
  items: readonly CatalogItem[]
}
