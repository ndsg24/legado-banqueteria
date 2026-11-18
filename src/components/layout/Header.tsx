import { useEffect, useRef } from 'react'
import { navigationItems } from '../../config/navigation'
import { useMobileMenu } from '../../hooks/useMobileMenu'
import type { SectionId } from '../../types/navigation'
import type { Theme } from '../../types/theme'
import { Brand } from './Brand'
import { ThemeToggle } from './ThemeToggle'
import { EditorialArrow } from '../ui/EditorialArrow'

type HeaderProps = {
  activeSection: SectionId | 'carta' | 'ambientacion' | 'cotizar'
  headerSection?: SectionId
  theme: Theme
  onThemeToggle: () => void
}

export function Header({ activeSection, headerSection, theme, onThemeToggle }: HeaderProps) {
  const { closeMenu, isOpen, menuRef, navigateToSection, toggleMenu, triggerRef } = useMobileMenu()

  const exploreRef = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !exploreRef.current?.contains(event.target) && exploreRef.current) exploreRef.current.open = false
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [])

  const isStandalonePage = activeSection === 'carta' || activeSection === 'ambientacion' || activeSection === 'cotizar'
  let headerTone = theme
  if (!isOpen && headerSection === 'inicio') headerTone = 'dark'
  if (!isOpen && headerSection === 'servicios') headerTone = theme === 'dark' ? 'light' : 'dark'
  const items = navigationItems.map((item) => ({
    ...item,
    href: isStandalonePage && item.href.startsWith('#')
      ? `${import.meta.env.BASE_URL}${item.href}`
      : item.href,
  }))

  return (
    <>
      <header data-tone={headerTone} data-section={isOpen ? undefined : headerSection} className={`site-header${isOpen ? ' menu-open' : ''}`}>
        <div className="site-header__inner">
          <Brand href={isStandalonePage ? `${import.meta.env.BASE_URL}#inicio` : '#inicio'} />
          <nav className="desktop-nav" aria-label="Navegación principal">
            <div className="desktop-nav__primary">
              {items.filter((item) => ['inicio', 'carta', 'ambientacion'].includes(item.id)).map((item) => (
                <a className={activeSection === item.id ? 'active' : undefined} href={item.href} aria-current={activeSection === item.id ? (isStandalonePage ? 'page' : 'location') : undefined} key={item.id}>{item.id === 'ambientacion' ? 'Diseña tu mesa' : item.label}</a>
              ))}
            </div>
            <details ref={exploreRef} className="desktop-nav__explore" onKeyDown={(event) => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus() } }}>
              <summary>Conoce Legado <span aria-hidden="true">+</span></summary>
              <div className="desktop-nav__dropdown">
                <div className="desktop-nav__story-panel">
                  <div className="desktop-nav__story-intro"><small>Somos Legado</small><strong>Detrás de<br /><em>cada encuentro.</em></strong><p>Una cocina familiar y una manera propia de celebrar.</p></div>
                  <div className="desktop-nav__chapters">
                    {items.filter((item) => ['historia', 'servicios', 'galeria', 'manera'].includes(item.id)).map((item, index) => <a href={item.href} key={item.id} aria-current={activeSection === item.id ? 'location' : undefined} onClick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}><small>{String(index + 1).padStart(2, '0')}</small><span><strong>{item.id === 'servicios' ? 'Lo que hacemos' : item.label}</strong><small>{({ historia: 'Nuestra historia, desde casa.', servicios: 'Celebraciones hechas a tu medida.', galeria: 'Momentos que ya compartimos.', manera: 'El cuidado detrás de cada detalle.' } as Record<string, string>)[item.id]}</small></span><i aria-hidden="true"><EditorialArrow direction="up-right" /></i></a>)}
                  </div>
                </div>
              </div>
            </details>
            <a className="desktop-nav__contact" href={items.find((item) => item.id === 'contacto')?.href}>Conversemos <span aria-hidden="true"><EditorialArrow direction="up-right" /></span></a>
          </nav>
          <div className="header-actions">
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            <button
              className="menu-toggle"
              type="button"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              onClick={toggleMenu}
              ref={triggerRef}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <div
        className={`mobile-menu${isOpen ? ' open' : ''}`}
        id="mobile-menu"
        aria-hidden={!isOpen}
        ref={menuRef}
        tabIndex={-1}
      >
        <p>Elige un capítulo</p>
        <nav aria-label="Navegación móvil">
          {items.map((item, index) => (
            <a
              className={activeSection === item.id ? 'active' : undefined}
              href={item.href}
              key={item.id}
              onClick={(event) => {
                if (item.href.startsWith('#')) {
                  event.preventDefault()
                  navigateToSection(item.href)
                } else {
                  closeMenu()
                }
              }}
            >
              <small>{String(index + 1).padStart(2, '0')}</small>
              <span>{item.label}</span>
              <i><EditorialArrow direction="up-right" /></i>
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
