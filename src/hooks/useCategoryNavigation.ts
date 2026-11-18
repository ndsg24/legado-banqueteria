import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { CatalogCategory } from '../types/catalog'

export function useCategoryNavigation(
  categories: readonly CatalogCategory[],
  activeId: string,
  onSelect: (id: string) => void,
) {
  const listRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const alignContentRef = useRef(false)
  const activeIndex = categories.findIndex((category) => category.id === activeId)

  useEffect(() => {
    const list = listRef.current
    const active = list?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
    if (!list || !active) return
    list.scrollTo({
      left: active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2,
      behavior: reducedMotion ? 'instant' : 'smooth',
    })

    if (!alignContentRef.current) return
    alignContentRef.current = false
    const navigation = list.closest<HTMLElement>('.tasting-menu')
    const dishes = document.getElementById('catalog-dishes')
    if (!navigation || !dishes || getComputedStyle(navigation).position !== 'sticky') return

    const headerHeight =
      document.querySelector('.site-header')?.getBoundingClientRect().height ?? 68
    window.scrollTo({
      top:
        window.scrollY +
        dishes.getBoundingClientRect().top -
        headerHeight -
        navigation.offsetHeight -
        16,
      behavior: reducedMotion ? 'instant' : 'smooth',
    })
  }, [activeId, reducedMotion])

  function selectCategory(id: string) {
    if (id === activeId) return
    alignContentRef.current = true
    onSelect(id)
  }

  function selectAdjacent(direction: -1 | 1) {
    const category = categories[activeIndex + direction]
    if (category) selectCategory(category.id)
  }

  return { listRef, activeIndex, selectAdjacent, selectCategory }
}
