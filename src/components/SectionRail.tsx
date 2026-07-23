import type { SectionId } from '../hooks/useActiveSection'

const sections: Array<{ id: SectionId; label: string }> = [
  { id: 'inicio', label: 'Portada' },
  { id: 'historia', label: 'Origen' },
  { id: 'servicios', label: 'La mesa' },
  { id: 'galeria', label: 'Galería' },
  { id: 'manera', label: 'Nuestra manera' },
  { id: 'contacto', label: 'Conversemos' },
]

type SectionRailProps = {
  activeSection: SectionId
}

export function SectionRail({ activeSection }: SectionRailProps) {
  return (
    <nav className="section-rail" aria-label="Navegación por capítulos">
      <span className="section-rail__line" aria-hidden="true" />
      {sections.map((section, index) => {
        const isActive = activeSection === section.id

        return (
          <a
            className={isActive ? 'active' : undefined}
            href={`#${section.id}`}
            aria-current={isActive ? 'location' : undefined}
            aria-label={`Ir a ${section.label}`}
            key={section.id}
          >
            <span className="section-rail__label">{section.label}</span>
            <i aria-hidden="true" />
            <small>{String(index + 1).padStart(2, '0')}</small>
          </a>
        )
      })}
    </nav>
  )
}
