import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { catalogCategories } from '../../../entities/menu'

export const catalogCollections = [
  { id: 'cocktail', filter: null, label: 'catalog.collections.cocktail', motif: 'extras' },
  { id: 'banquet', filter: 'menu', label: 'catalog.collections.menu', motif: 'principales' },
  { id: 'drinks', filter: 'bebestibles', label: 'catalog.collections.drinks', motif: 'aperitivos' },
] as const

export function useCatalog() {
  const { search, hash } = useLocation()
  const navigate = useNavigate()
  const categoryId = new URLSearchParams(search).get('categoria')
  const activeCategory = catalogCategories.find((category) => category.id === categoryId)
  const collection =
    catalogCollections.find((option) =>
      activeCategory ? option.id === activeCategory.collection : option.filter === categoryId,
    ) ?? catalogCollections[0]
  const categories = useMemo(
    () => catalogCategories.filter((category) => category.collection === collection.id),
    [collection],
  )
  const visibleCategories = useMemo(
    () => (activeCategory ? [activeCategory] : categories),
    [activeCategory, categories],
  )

  function setFilter(id: string | null) {
    if (id === categoryId) return
    const params = new URLSearchParams(search)
    if (id) params.set('categoria', id)
    else params.delete('categoria')
    void navigate({ search: params.toString(), hash }, { preventScrollReset: true })
  }

  return {
    collection: collection.id,
    isOverview: categoryId === null,
    title: activeCategory?.label ?? collection.label,
    changeCollection: (next: typeof collection) => setFilter(next.filter),
    categories,
    visibleCategories,
    activeCategory,
    setCategoryId: (id: string | null) => setFilter(id ?? collection.filter),
  }
}
