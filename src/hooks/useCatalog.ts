import { useEffect, useState } from 'react'
import { readQuantities, saveQuantities, withQuantity } from '../quote/quantities'
import { catalogCategories } from '../config/catalog'
import type { CatalogCollection } from '../types/catalog'

export function useCatalog() {
  const [collection, setCollection] = useState<CatalogCollection>('cocktail')
  const [categoryId, setCategoryId] = useState(catalogCategories[0].id)
  const [quantities, setQuantities] = useState(() => readQuantities())
  const selectedIds = Object.keys(quantities)
  useEffect(() => saveQuantities(quantities), [quantities])
  useEffect(() => {
    const restoreSelection = (event: PageTransitionEvent) => {
      if (event.persisted) setQuantities(readQuantities())
    }
    window.addEventListener('pageshow', restoreSelection)
    return () => window.removeEventListener('pageshow', restoreSelection)
  }, [])
  const categories = catalogCategories.filter((category) => category.collection === collection)
  const activeCategory = categories.find((category) => category.id === categoryId) ?? categories[0]
  const selectedItems = catalogCategories.flatMap((category) => category.items).filter((item) => selectedIds.includes(item.id))

  function changeCollection(next: CatalogCollection) {
    setCollection(next)
    setCategoryId(catalogCategories.find((category) => category.collection === next)!.id)
  }

  function toggleItem(id: string) {
    setQuantities(current => withQuantity(current, id, current[id] ? 0 : 1))
  }

  function setQuantity(id: string, quantity: number) {
    setQuantities(current => withQuantity(current, id, quantity))
  }

  return { quantities, setQuantity, collection, changeCollection, categories, activeCategory, setCategoryId, selectedIds, selectedItems, toggleItem, clearSelection: () => setQuantities({}) }
}
