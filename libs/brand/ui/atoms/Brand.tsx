import { useI18n } from '../../i18n'
import { Link } from 'react-router'
type BrandProps = { href?: string; onClick?: () => void }

export function Brand({ href = '#inicio', onClick }: BrandProps) {
  const { t } = useI18n()

  return (
    <Link className="brand" to={href} onClick={onClick} aria-label={t('common.nav.brandHome')}>
      <strong>
        LEGA<span>·</span>DO
      </strong>
      <small>{t('common.nav.brandTagline')}</small>
    </Link>
  )
}
