import { navigationItems } from '../../config/navigation'
import type { SectionId } from '../../types/navigation'

type SectionRailProps = {
  activeSection: SectionId
}

export function SectionRail({ activeSection }: SectionRailProps) {
  return (
    <nav className="section-rail" aria-label="Navegación por capítulos">
      <span className="section-rail__line" aria-hidden="true" />
      {navigationItems.map((section, index) => {
        const isActive = activeSection === section.id

        return (
          <a
            className={isActive ? 'active' : undefined}
            href={`#${section.id}`}
            aria-current={isActive ? 'location' : undefined}
            aria-label={`Ir a ${section.railLabel}`}
            key={section.id}
          >
            <span className="section-rail__label">{section.railLabel}</span>
            <i aria-hidden="true" />
            <small>{String(index + 1).padStart(2, '0')}</small>
          </a>
        )
      })}
    </nav>
  )
}
