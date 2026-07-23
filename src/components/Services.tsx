const services = [
  {
    title: 'Matrimonios',
    copy: 'Un menú que acompaña el día completo, sin quitarle protagonismo a lo importante.',
    note: 'Celebrar',
  },
  {
    title: 'Encuentros familiares',
    copy: 'Bautizos, aniversarios y cumpleaños con esa comida que hace que todos se queden un rato más.',
    note: 'Compartir',
  },
  {
    title: 'Eventos de empresa',
    copy: 'Almuerzos y jornadas resueltas con puntualidad, calidez y comida de verdad.',
    note: 'Reunir',
  },
]

export function Services() {
  return (
    <section className="services" id="servicios">
      <div className="services__header">
        <div>
          <span>La mesa</span>
          <strong>02 — 03</strong>
        </div>
        <h2>No hacemos eventos.<br /><em>Vestimos recuerdos.</em></h2>
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
            <i aria-hidden="true">→</i>
          </article>
        ))}
      </div>
    </section>
  )
}
