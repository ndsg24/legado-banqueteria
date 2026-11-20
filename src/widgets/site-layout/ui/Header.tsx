import { type MessageKey, useI18n } from '../../../shared/i18n'
import { Link } from 'react-router'
import { useEffect, useRef } from 'react'
import { navigationItems, type SectionId } from '../../../shared/routing'
import { useMobileMenu } from '../model/useMobileMenu'
import type { Theme } from '../../../shared/theme'
import { Brand } from './Brand'
import { LanguagePicker } from './LanguagePicker'
import { ThemeToggle } from './ThemeToggle'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'

type HeaderProps = {
  activeSection: SectionId | 'carta' | 'ambientacion' | 'cotizar'
  headerSection?: SectionId
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

export function Header({ activeSection, headerSection, theme, onThemeChange }: HeaderProps) {
  const { t } = useI18n()

  const { closeMenu, isOpen, menuRef, toggleMenu, triggerRef } = useMobileMenu()

  const exploreRef = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !exploreRef.current?.contains(event.target) &&
        exploreRef.current
      )
        exploreRef.current.open = false
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [])

  const isStandalonePage =
    activeSection === 'carta' || activeSection === 'ambientacion' || activeSection === 'cotizar'
  let headerTone = theme
  if (!isOpen && headerSection === 'servicios')
    headerTone = theme === 'light' || theme === 'pool' ? 'dark' : 'light'
  const items = navigationItems.map((item) => ({
    ...item,
    href: isStandalonePage && item.href.startsWith('#') ? `/${item.href}` : item.href,
  }))

  return (
    <>
      <header
        data-tone={headerTone}
        data-section={isOpen ? undefined : headerSection}
        className={`site-header${isOpen ? ' menu-open' : ''}`}
      >
        <div className="site-header__inner">
          <Brand href={isStandalonePage ? '/#inicio' : '#inicio'} />
          <nav className="desktop-nav" aria-label={t('common.nav.primary')}>
            <div className="desktop-nav__primary">
              {items
                .filter((item) => ['inicio', 'carta', 'ambientacion'].includes(item.id))
                .map((item) => (
                  <Link
                    className={activeSection === item.id ? 'active' : undefined}
                    to={item.href}
                    aria-current={
                      activeSection === item.id
                        ? isStandalonePage
                          ? 'page'
                          : 'location'
                        : undefined
                    }
                    key={item.id}
                  >
                    {item.id === 'ambientacion' ? t('catalog.intro.designTable') : t(item.label)}
                  </Link>
                ))}
            </div>
            <details
              ref={exploreRef}
              className="desktop-nav__explore"
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.currentTarget.open = false
                  event.currentTarget.querySelector('summary')?.focus()
                }
              }}
            >
              <summary>
                {t('common.nav.about')} <span aria-hidden="true">+</span>
              </summary>
              <div className="desktop-nav__dropdown">
                <div className="desktop-nav__story-panel">
                  <div className="desktop-nav__story-intro">
                    <small>{t('common.nav.aboutEyebrow')}</small>
                    <strong>
                      {t('common.nav.aboutTitle')}
                      <br />
                      <em>{t('common.nav.aboutAccent')}</em>
                    </strong>
                    <p>{t('common.nav.aboutDescription')}</p>
                  </div>
                  <div className="desktop-nav__chapters">
                    {items
                      .filter((item) =>
                        ['historia', 'servicios', 'galeria', 'manera'].includes(item.id),
                      )
                      .map((item, index) => (
                        <Link
                          to={item.href}
                          key={item.id}
                          aria-current={activeSection === item.id ? 'location' : undefined}
                          onClick={(event) =>
                            event.currentTarget.closest('details')?.removeAttribute('open')
                          }
                        >
                          <small>{String(index + 1).padStart(2, '0')}</small>
                          <span>
                            <strong>
                              {item.id === 'servicios' ? t('common.nav.services') : t(item.label)}
                            </strong>
                            <small>
                              {t(
                                (
                                  {
                                    historia: 'common.nav.storyDetail',
                                    servicios: 'common.nav.servicesDetail',
                                    galeria: 'common.nav.galleryDetail',
                                    manera: 'common.nav.manifestoDetail',
                                  } as Record<string, MessageKey>
                                )[item.id],
                              )}
                            </small>
                          </span>
                          <i aria-hidden="true">
                            <EditorialArrow direction="up-right" />
                          </i>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </details>
            <Link
              className="desktop-nav__contact"
              to={isStandalonePage ? '/#contacto' : '#contacto'}
            >
              {t('common.nav.contact')}{' '}
              <span aria-hidden="true">
                <EditorialArrow direction="up-right" />
              </span>
            </Link>
          </nav>
          <div className="header-actions">
            {(!isOpen || isStandalonePage) && <LanguagePicker />}
            <ThemeToggle theme={theme} onChange={onThemeChange} />
            <button
              className="menu-toggle"
              type="button"
              aria-label={isOpen ? t('common.nav.close') : t('common.nav.open')}
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
        <p>{t('common.nav.chooseChapter')}</p>
        <nav aria-label={t('common.nav.mobile')}>
          {items.map((item, index) => (
            <Link
              className={activeSection === item.id ? 'active' : undefined}
              to={item.href}
              key={item.id}
              onClick={closeMenu}
            >
              <small>{String(index + 1).padStart(2, '0')}</small>
              <span>{t(item.label)}</span>
              <i>
                <EditorialArrow direction="up-right" />
              </i>
            </Link>
          ))}
        </nav>
        <div className="mobile-menu__footer">
          <span>{t('common.nav.mobileSignature')}</span>
          {isOpen && !isStandalonePage && <LanguagePicker />}
          <ThemeToggle theme={theme} onChange={onThemeChange} />
        </div>
      </div>
    </>
  )
}
