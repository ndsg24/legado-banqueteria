const services = [
  {
    title: 'Matrimonios',
    copy: 'Menús generosos y un servicio atento para celebrar sin preocuparse de nada.',
  },
  {
    title: 'Encuentros familiares',
    copy: 'Bautizos, aniversarios y cumpleaños con preparaciones que todos reconocen y disfrutan.',
  },
  {
    title: 'Eventos de empresa',
    copy: 'Almuerzos, celebraciones y jornadas de equipo resueltas con calidez y puntualidad.',
  },
]

export function Services() {
  return (
    <section className="services" id="servicios">
      <div className="services__intro">
        <p className="eyebrow">Para reunirnos</p>
        <h2>Tu ocasión,<br /><em>nuestra mesa.</em></h2>
        <p>Adaptamos cada propuesta al tipo de encuentro, sus tiempos y las personas que quieres recibir.</p>
      </div>
      <div className="services__list">
        {services.map((service, index) => (
          <article className="service" key={service.title}>
            <span>0{index + 1}</span>
            <div>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </div>
            <i aria-hidden="true">↗</i>
          </article>
        ))}
      </div>
    </section>
  )
}
