import type { NavigationItem } from '../types/navigation'

export const navigationItems = [
  { href: '#inicio', id: 'inicio', label: 'Inicio', railLabel: 'Portada' },
  { href: '#historia', id: 'historia', label: 'Origen', railLabel: 'Origen' },
  { href: '#servicios', id: 'servicios', label: 'La mesa', railLabel: 'La mesa' },
  { href: '#galeria', id: 'galeria', label: 'Galería', railLabel: 'Galería' },
  { href: '#manera', id: 'manera', label: 'Nuestra manera', railLabel: 'Nuestra manera' },
  { href: '#contacto', id: 'contacto', label: 'Conversemos', railLabel: 'Conversemos' },
] as const satisfies readonly NavigationItem[]
