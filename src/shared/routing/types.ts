import type { MessageKey } from '../i18n'
export const sectionIds = [
  'inicio',
  'historia',
  'servicios',
  'galeria',
  'manera',
  'contacto',
] as const

export type SectionId = (typeof sectionIds)[number]

export type NavigationItem = {
  id: SectionId | 'carta' | 'ambientacion'
  href: string
  label: MessageKey
  railLabel: MessageKey
}
