import { navigationItems } from '../../config/navigation'
import { useMobileMenu } from '../../hooks/useMobileMenu'
import type { SectionId } from '../../types/navigation'
import type { Theme } from '../../types/theme'
import { Brand } from './Brand'
import { ThemeToggle } from './ThemeToggle'
import { EditorialArrow } from '../ui/EditorialArrow'

type HeaderProps = {
  activeSection: SectionId | 'carta'
  theme: Theme
  onThemeToggle: () => void
}

export function Header({ activeSection, theme, onThemeToggle }: HeaderProps) {
  const { closeMenu, isOpen, menuRef, navigateToSection, toggleMenu, triggerRef } = useMobileMenu()

  const isCatalogPage = activeSection === 'carta'
  const items = navigationItems.map((item) => ({
    ...item,
    href: isCatalogPage && item.href.startsWith('#')
      ? `${import.meta.env.BASE_URL}${item.href}`
      : item.href,
  }))

  return (
    <>
      <header className={`site-header${isOpen ? ' menu-open' : ''}`}>
        <div className="site-header__inner">
          <Brand href={isCatalogPage ? `${import.meta.env.BASE_URL}#inicio` : '#inicio'} />
          <nav className="desktop-nav" aria-label="Navegación principal">
            {items.map((item) => (
              <a
                className={activeSection === item.id ? 'active' : undefined}
                href={item.href}
                aria-current={activeSection === item.id ? (isCatalogPage ? 'page' : 'location') : undefined}
                key={item.id}
              >
                {item.label}
              </a>
            ))}
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
