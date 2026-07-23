import { useEffect, useRef, useState } from 'react'
import type { SectionId } from '../hooks/useActiveSection'
import { Brand } from './Brand'
import { ThemeToggle } from './ThemeToggle'

type HeaderProps = {
  activeSection: SectionId
  theme: 'light' | 'dark'
  onThemeToggle: () => void
}

const navigation = [
  { href: '#inicio', id: 'inicio', label: 'Inicio' },
  { href: '#historia', id: 'historia', label: 'Origen' },
  { href: '#servicios', id: 'servicios', label: 'La mesa' },
  { href: '#galeria', id: 'galeria', label: 'Galería' },
  { href: '#manera', id: 'manera', label: 'Nuestra manera' },
  { href: '#contacto', id: 'contacto', label: 'Conversemos' },
] as const

export function Header({ activeSection, theme, onThemeToggle }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    menuRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      triggerRef.current?.focus()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  return (
    <>
      <header className={`site-header${menuOpen ? ' menu-open' : ''}`}>
        <div className="site-header__inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Navegación principal">
            {navigation.map((item) => (
              <a className={activeSection === item.id ? 'active' : undefined} href={item.href} key={item.id}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((current) => !current)}
              ref={triggerRef}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <div
        className={`mobile-menu${menuOpen ? ' open' : ''}`}
        id="mobile-menu"
        aria-hidden={!menuOpen}
        ref={menuRef}
        tabIndex={-1}
      >
        <p>Elige un capítulo</p>
        <nav aria-label="Navegación móvil">
          {navigation.map((item, index) => (
            <a
              className={activeSection === item.id ? 'active' : undefined}
              href={item.href}
              key={item.id}
              onClick={() => setMenuOpen(false)}
            >
              <small>{String(index + 1).padStart(2, '0')}</small>
              <span>{item.label}</span>
              <i>↗</i>
            </a>
          ))}
        </nav>
        <div className="mobile-menu__footer">
          <span>Legado / Banquetería familiar</span>
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
    </>
  )
}
