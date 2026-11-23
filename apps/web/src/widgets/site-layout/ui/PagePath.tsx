import { useI18n } from '../../../shared/i18n'
import { Link } from 'react-router'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'
type PagePathProps = { href: string; backLabel: string; current: string }
export function PagePath({ href, backLabel, current }: PagePathProps) {
  const { t } = useI18n()

  return (
    <nav className="page-path" aria-label={t('common.nav.breadcrumb')}>
      <Link to={href}>
        <span aria-hidden="true">
          <EditorialArrow direction="left" />
        </span>
        {backLabel}
      </Link>
      <p>
        Legado <span aria-hidden="true">/</span>
        {current}
      </p>
    </nav>
  )
}
