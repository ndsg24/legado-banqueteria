import { useI18n } from '../../../shared/i18n'
import { Link } from 'react-router'
import { quoteHref } from '../../../shared/routing'
import { siteConfig } from '../../../shared/config/site'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'

export function Contact() {
  const { t } = useI18n()

  return (
    <section className="contact" id="contacto">
      <div className="contact__index">
        <span>{t('quote.event.celebration')}</span>
        <strong>04 — 04</strong>
      </div>
      <p className="contact__pretitle">{t('home.contact.intro')}</p>
      <h2>
        {t('home.contact.title')}
        <br />
        <em>{t('home.contact.accent')}</em>
      </h2>
      <p>{t('home.contact.description')}</p>
      <div className="contact__actions">
        <Link className="button button--gold" to={quoteHref()}>
          <span>{t('home.contact.quote')}</span>
          <EditorialArrow direction="up-right" />
        </Link>
        {siteConfig.whatsappUrl && (
          <a
            href={
              siteConfig.whatsappUrl +
              '?text=' +
              encodeURIComponent(t('home.contact.whatsappMessage'))
            }
            target="_blank"
            rel="noreferrer"
          >
            {t('home.contact.whatsapp')}
          </a>
        )}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </div>
    </section>
  )
}
