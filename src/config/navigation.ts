import type { NavigationItem } from '../types/navigation'

export const sectionNavigationItems = [
  { href: '#inicio', id: 'inicio', label: 'Inicio', railLabel: 'Portada' },
  { href: '#historia', id: 'historia', label: 'Origen', railLabel: 'Origen' },
  { href: '#servicios', id: 'servicios', label: 'La mesa', railLabel: 'La mesa' },
  { href: '#galeria', id: 'galeria', label: 'Galería', railLabel: 'Galería' },
  { href: '#manera', id: 'manera', label: 'Nuestra manera', railLabel: 'Nuestra manera' },
  { href: '#contacto', id: 'contacto', label: 'Conversemos', railLabel: 'Conversemos' },
] as const satisfies readonly NavigationItem[]

export const navigationItems = [
  ...sectionNavigationItems.slice(0, 3),
  {
    href: `${import.meta.env.BASE_URL}carta.html`,
    id: 'carta',
    label: 'La carta',
    railLabel: 'La carta',
  },
  ...sectionNavigationItems.slice(3),
] as const satisfies readonly NavigationItem[]
