import type { NavigationItem } from './types'

export const sectionNavigationItems = [
  { href: '#inicio', id: 'inicio', label: 'common.nav.home', railLabel: 'common.nav.cover' },
  { href: '#historia', id: 'historia', label: 'common.nav.origin', railLabel: 'common.nav.origin' },
  { href: '#servicios', id: 'servicios', label: 'common.nav.table', railLabel: 'common.nav.table' },
  { href: '#galeria', id: 'galeria', label: 'common.nav.gallery', railLabel: 'common.nav.gallery' },
  {
    href: '#manera',
    id: 'manera',
    label: 'common.nav.manifesto',
    railLabel: 'common.nav.manifesto',
  },
  {
    href: '#contacto',
    id: 'contacto',
    label: 'common.nav.contact',
    railLabel: 'common.nav.contact',
  },
] as const satisfies readonly NavigationItem[]

export const navigationItems = [
  ...sectionNavigationItems.slice(0, 3),
  {
    href: '/carta.html',
    id: 'carta',
    label: 'common.nav.catalog',
    railLabel: 'common.nav.catalog',
  },
  {
    href: '/ambientacion.html',
    id: 'ambientacion',
    label: 'common.nav.yourTable',
    railLabel: 'common.nav.yourTable',
  },
  ...sectionNavigationItems.slice(3),
] as const satisfies readonly NavigationItem[]
