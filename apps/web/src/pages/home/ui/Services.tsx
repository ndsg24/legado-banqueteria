import { useI18n } from '../../../shared/i18n'
import { services } from '../model/content'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'

export function Services() {
  const { t } = useI18n()

  return (
    <section className="services" id="servicios">
      <div className="services__header">
        <div>
          <span>{t('table.view.table')}</span>
          <strong>02 — 04</strong>
        </div>
        <h2>
          {t('home.services.title')}
          <br />
          <em>{t('home.services.accent')}</em>
        </h2>
      </div>
      <div className="services__list">
        {services.map((service, index) => (
          <article className="service" key={service.title}>
            <span className="service__number">{String(index + 1).padStart(2, '0')}</span>
            <div className="service__content">
              <span>{t(service.note)}</span>
              <h3>{t(service.title)}</h3>
              <p>{t(service.copy)}</p>
            </div>
            <i aria-hidden="true">
              <EditorialArrow />
            </i>
          </article>
        ))}
      </div>
    </section>
  )
}
