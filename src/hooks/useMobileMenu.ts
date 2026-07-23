import { useCallback, useEffect, useRef, useState } from 'react'

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const previousOverflowRef = useRef('')

  const closeMenu = useCallback(() => setIsOpen(false), [])
  const toggleMenu = useCallback(() => setIsOpen((current) => !current), [])
  const navigateToSection = useCallback((href: string) => {
    document.body.style.overflow = previousOverflowRef.current
    setIsOpen(false)

    window.history.pushState(null, '', href)
    window.dispatchEvent(new HashChangeEvent('hashchange'))

    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(href)
      if (!target) return

      const rootStyle = document.documentElement.style
      const previousScrollBehavior = rootStyle.scrollBehavior
      const previousScrollSnapType = rootStyle.scrollSnapType

      rootStyle.scrollBehavior = 'auto'
      rootStyle.scrollSnapType = 'none'
      target.scrollIntoView({ block: 'start' })

      requestAnimationFrame(() => {
        rootStyle.scrollBehavior = previousScrollBehavior
        rootStyle.scrollSnapType = previousScrollSnapType
      })
    })
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    previousOverflowRef.current = previousOverflow
    document.body.style.overflow = 'hidden'
    menuRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      closeMenu()
      triggerRef.current?.focus()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeMenu, isOpen])

  return {
    closeMenu,
    isOpen,
    menuRef,
    navigateToSection,
    toggleMenu,
    triggerRef,
  }
}
