import { useState } from 'react'
import { catalogCategories } from '../config/catalog'
import type { CatalogCollection } from '../types/catalog'

export function useCatalog() {
  const [collection, setCollection] = useState<CatalogCollection>('cocktail')
  const [categoryId, setCategoryId] = useState(catalogCategories[0].id)
  const [selectedIds, setSelectedIds] = useState<readonly string[]>([])
  const categories = catalogCategories.filter((category) => category.collection === collection)
  const activeCategory = categories.find((category) => category.id === categoryId) ?? categories[0]
  const selectedItems = catalogCategories.flatMap((category) => category.items).filter((item) => selectedIds.includes(item.id))

  function changeCollection(next: CatalogCollection) {
    setCollection(next)
    setCategoryId(catalogCategories.find((category) => category.collection === next)!.id)
  }

  function toggleItem(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  return { collection, changeCollection, categories, activeCategory, setCategoryId, selectedIds, selectedItems, toggleItem, clearSelection: () => setSelectedIds([]) }
}
