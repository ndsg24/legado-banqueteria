import { services } from '../../config/content'
import { EditorialArrow } from '../ui/EditorialArrow'

export function Services() {
  return (
    <section className="services" id="servicios">
      <div className="services__header">
        <div>
          <span>La mesa</span>
          <strong>02 — 04</strong>
        </div>
        <h2>Hay días que piden<br /><em>una mesa distinta.</em></h2>
      </div>
      <div className="services__list">
        {services.map((service, index) => (
          <article className="service" key={service.title}>
            <span className="service__number">{String(index + 1).padStart(2, '0')}</span>
            <div className="service__content">
              <span>{service.note}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </div>
            <i aria-hidden="true"><EditorialArrow /></i>
          </article>
        ))}
      </div>
    </section>
  )
}
