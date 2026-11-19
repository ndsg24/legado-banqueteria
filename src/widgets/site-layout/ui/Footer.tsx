import { useI18n } from '../../../shared/i18n'
import { Link, useLocation } from 'react-router'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'
import { Brand } from './Brand'

type FooterProps = { homeHref?: string; topHref?: string }

export function Footer({ homeHref = '#inicio', topHref = '#inicio' }: FooterProps) {
  const { t } = useI18n()

  const { search } = useLocation()
  return (
    <footer>
      <Brand href={homeHref} />
      <p>
        {t('common.footer.taglineLead')}
        <br />
        {t('common.footer.taglineEnd')}
      </p>
      <section className="footer-socials" aria-labelledby="footer-socials-title">
        <h2 id="footer-socials-title">{t('common.footer.social')}</h2>
        <ul>
          <li>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.6" cy="6.6" r="1" fill="currentColor" stroke="none" />
            </svg>
            Instagram
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M14 2h3a6 6 0 0 0 5 5v3a9 9 0 0 1-5-2v8a6.5 6.5 0 1 1-7-6.5v3.2a3.3 3.3 0 1 0 4 3.3Z" />
            </svg>
            TikTok
          </li>
        </ul>
      </section>
      <div className="footer-meta">
        <Link to={{ search, hash: topHref }}>
          {t('common.footer.top')} <EditorialArrow direction="up" />
        </Link>
        <span>© {new Date().getFullYear()} Legado</span>
      </div>
    </footer>
  )
}
