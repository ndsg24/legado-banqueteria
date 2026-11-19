import { useI18n } from '../../../shared/i18n'
import { Link } from 'react-router'
type BrandProps = { href?: string }

export function Brand({ href = '#inicio' }: BrandProps) {
  const { t } = useI18n()

  return (
    <Link className="brand" to={href} aria-label={t('common.nav.brandHome')}>
      <strong>
        LEGA<span>·</span>DO
      </strong>
      <small>{t('common.nav.brandTagline')}</small>
    </Link>
  )
}
