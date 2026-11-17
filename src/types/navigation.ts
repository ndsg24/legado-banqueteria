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
  id: SectionId | 'carta'
  href: string
  label: string
  railLabel: string
}
