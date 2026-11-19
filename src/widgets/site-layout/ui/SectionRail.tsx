import { useI18n } from '../../../shared/i18n'
import { Link } from 'react-router'
import { sectionNavigationItems, type SectionId } from '../../../shared/routing'

type SectionRailProps = {
  activeSection: SectionId
}

export function SectionRail({ activeSection }: SectionRailProps) {
  const { t } = useI18n()

  return (
    <nav className="section-rail" aria-label={t('common.nav.chapters')}>
      <span className="section-rail__line" aria-hidden="true" />
      {sectionNavigationItems.map((section, index) => {
        const isActive = activeSection === section.id

        return (
          <Link
            className={isActive ? 'active' : undefined}
            to={`#${section.id}`}
            aria-current={isActive ? 'location' : undefined}
            aria-label={t('common.nav.goTo', { name: t(section.railLabel) })}
            key={section.id}
          >
            <span className="section-rail__label">{t(section.railLabel)}</span>
            <i aria-hidden="true" />
            <small>{String(index + 1).padStart(2, '0')}</small>
          </Link>
        )
      })}
    </nav>
  )
}
