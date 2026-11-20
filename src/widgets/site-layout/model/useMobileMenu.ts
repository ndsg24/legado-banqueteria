import { useCallback, useEffect, useRef, useState } from 'react'

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => setIsOpen(false), [])
  const toggleMenu = useCallback(() => setIsOpen((current) => !current), [])
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    menuRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      closeMenu()
      triggerRef.current?.focus()
    }

    const compact = matchMedia(
      '(max-width: 900px), (orientation: portrait) and (max-width: 1100px), ' +
        '(any-pointer: coarse) and (max-width: 1440px)',
    )
    const closeOnResize = () => {
      if (!compact.matches) closeMenu()
    }
    compact.addEventListener('change', closeOnResize)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      compact.removeEventListener('change', closeOnResize)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeMenu, isOpen])

  return {
    closeMenu,
    isOpen,
    menuRef,
    toggleMenu,
    triggerRef,
  }
}
