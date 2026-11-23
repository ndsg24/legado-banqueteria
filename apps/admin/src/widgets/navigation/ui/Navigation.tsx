import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { Brand } from '@legado/brand/controls'
import { DottedTexture } from '@legado/brand/dotted-texture'
import { useI18n } from '@legado/brand/i18n'
import { QuickAccess } from './QuickAccess'
import { ProfileDropdown } from '../../../features/profile'
import type { Profile } from '../../../entities/session'
import './navigation.css'
import { navigationSections } from '../model/sections'
import { messages } from '../../../shared/config/messages'

const compactViewport = '(max-width: 1024px), (max-width: 1366px) and (pointer: coarse)'

const paths = {
  menu: 'M3 6h18M3 12h18M3 18h18',
  close: 'm5 5 14 14M19 5 5 19',
  collapse: 'M3 4h18v16H3zM9 4v16m8-11-3 3 3 3',
  expand: 'M3 4h18v16H3zM9 4v16m4-11 3 3-3 3',
  dashboard: 'M3 3h8v10H3zM14 3h7v6h-7zM3 16h8v5H3zM14 12h7v9h-7z',
  quotes: 'M5 3h10l4 4v14H5zM14 3v5h5M8 12h8M8 16h6',
  calendar: 'M3 6h18v15H3zM3 10h18M7 3v5m10-5v5M7 14h3m2 0h3m-8 3h3',
  prep: 'M3 16h18M5 16a7 7 0 0 1 14 0M12 9V7m-6 12h12',
  recipes: 'M3 5q5-2 9 1 4-3 9-1v14q-5-2-9 1-4-3-9-1zm9 1v14',
  shopping: 'M3 10h18l-2 10H5zM7 10l4-7m6 7-4-7m-5 11v3m4-3v3m4-3v3',
  billing: 'M5 3h14v18l-3-2-4 2-4-2-3 2zM8 8h8m-8 4h8m-8 4h4',
  content: 'M3 4h18v16H3zM3 8h18m-15 9 4-5 3 3 2-2 3 4',
}
function Icon({ name }: { name: keyof typeof paths }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}

const upcoming = ['billing'] as const

function MenuItems({ activePath, close }: { activePath?: string; close?: () => void }) {
  const { language } = useI18n()
  const copy = messages[language]
  return (
    <>
      {navigationSections(language).map((group) => (
        <section key={group.label} className="nav-group" aria-label={group.label}>
          <h3>{group.label}</h3>
          {group.items.map(({ path: to, label, icon }) => {
            const active = activePath === to
            return (
              <Link
                key={to}
                to={to}
                className={'admin-nav-item' + (active ? ' current' : '')}
                aria-label={label}
                title={label}
                aria-current={active ? 'page' : undefined}
                onClick={close}
              >
                <Icon name={icon} />
                <span>{label}</span>
              </Link>
            )
          })}
        </section>
      ))}
      <section className="admin-roadmap" aria-label={copy.planned}>
        <h3>{copy.planned}</h3>
        <ul>
          {upcoming.map((key) => (
            <li key={key} className="admin-nav-item" title={copy[key] + ' · ' + copy.planned}>
              <Icon name={key} />
              <span>{copy[key]}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

export function Navigation({
  children,
  dashboardDate,
  preferences,
  profile,
}: {
  children: ReactNode
  dashboardDate?: string
  profile: Profile
  preferences: ReactNode
}) {
  const { language, locale } = useI18n()
  const copy = messages[language]
  const { pathname } = useLocation()
  const sectionPath = /^\/\d+(?:\/|$)/.test(pathname) ? '/quotes' : '/' + pathname.split('/')[1]
  const activeSection = navigationSections(language)
    .flatMap(({ items }) => [...items])
    .find(({ path }) => path === sectionPath)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('legado-admin-sidebar') === 'collapsed'
    } catch {
      return false
    }
  })
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const media = matchMedia(compactViewport)
    function resize() {
      if (!media.matches) dialog.current?.close()
    }
    media.addEventListener('change', resize)
    return () => media.removeEventListener('change', resize)
  }, [])
  function toggle() {
    setCollapsed(!collapsed)
    try {
      localStorage.setItem('legado-admin-sidebar', collapsed ? 'expanded' : 'collapsed')
    } catch {
      /* optional */
    }
  }
  return (
    <div className="admin-layout" data-collapsed={collapsed}>
      <DottedTexture />
      <a href="#admin-content" className="skip-navigation">
        {copy.skipNavigation}
      </a>
      <header className="masthead admin-masthead" data-tone="navigation">
        <div className="admin-brand">
          <button
            ref={trigger}
            className="mobile-trigger nav-toggle"
            aria-controls="mobile-nav"
            aria-expanded={open}
            aria-label={copy.openMenu}
            onClick={() => {
              dialog.current?.showModal()
              setOpen(true)
            }}
          >
            <Icon name="menu" />
          </button>
          <div className="admin-section">
            <span className="admin-name" title={activeSection?.label ?? copy.admin}>
              {activeSection?.label ?? copy.admin}
            </span>
            {dashboardDate && (
              <time className="admin-date" dateTime={dashboardDate}>
                <span>
                  {new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' }).format(
                    new Date(dashboardDate),
                  )}
                </span>
                <span>
                  {new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(
                    new Date(dashboardDate),
                  )}
                </span>
              </time>
            )}
          </div>
        </div>
        <div className="admin-toolbar">
          <QuickAccess />
          {preferences}
          <ProfileDropdown profile={profile} />
        </div>
      </header>
      <aside className="sidebar table-watermark" data-tone="navigation">
        <div className="sidebar-brand">
          <Brand href="/" />
          <button
            className="nav-toggle"
            onClick={toggle}
            aria-expanded={!collapsed}
            aria-controls="desk-nav"
            aria-label={collapsed ? copy.expand : copy.collapse}
            title={collapsed ? copy.expand : copy.collapse}
          >
            <Icon name={collapsed ? 'expand' : 'collapse'} />
          </button>
        </div>
        <nav aria-label={copy.navigation} id="desk-nav">
          <MenuItems activePath={activeSection?.path} />
        </nav>
      </aside>
      <div className="workspace">{children}</div>
      <dialog
        ref={dialog}
        id="mobile-nav"
        className="mobile-nav table-watermark"
        data-tone="navigation"
        aria-label={copy.navigation}
        onClose={() => {
          setOpen(false)
          if (matchMedia(compactViewport).matches) trigger.current?.focus()
        }}
      >
        <header>
          <Brand href="/" onClick={() => dialog.current?.close()} />
          <button
            className="nav-toggle"
            aria-label={copy.closeMenu}
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
        </header>
        <nav aria-label={copy.navigation}>
          <MenuItems activePath={activeSection?.path} close={() => dialog.current?.close()} />
        </nav>
        <footer>
          <ProfileDropdown profile={profile} />
        </footer>
      </dialog>
    </div>
  )
}
