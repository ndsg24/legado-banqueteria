import { useState } from 'react'
import { catalogCategories } from '../config/catalog'
import type { CatalogCollection } from '../types/catalog'

export function useCatalog() {
  const [collection, setCollection] = useState<CatalogCollection>('cocktail')
  const [categoryId, setCategoryId] = useState(catalogCategories[0].id)
  const categories = catalogCategories.filter((category) => category.collection === collection)
  const activeCategory = categories.find((category) => category.id === categoryId) ?? categories[0]

  function changeCollection(next: CatalogCollection) {
    setCollection(next)
    setCategoryId(catalogCategories.find((category) => category.collection === next)!.id)
  }

  return { collection, changeCollection, categories, activeCategory, setCategoryId }
}
