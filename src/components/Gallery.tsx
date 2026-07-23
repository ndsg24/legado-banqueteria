const galleryItems = [
  {
    src: 'event-05.jpg',
    alt: 'Celebración nocturna con una larga mesa preparada entre palmeras',
    title: 'Cuando cae la noche',
    detail: 'Montaje exterior',
  },
  {
    src: 'event-04.jpg',
    alt: 'Puesto de mesa con flores, limones y cubiertos dorados',
    title: 'Todo está en los detalles',
    detail: 'Mesa de celebración',
  },
  {
    src: 'event-01.jpg',
    alt: 'Invitados compartiendo durante una celebración familiar',
    title: 'La gente es el centro',
    detail: 'Encuentro íntimo',
  },
  {
    src: 'event-03.jpg',
    alt: 'Mesa preparada con flores, velas y cristalería',
    title: 'Antes de que lleguen',
    detail: 'Preparación',
  },
  {
    src: 'event-06.jpg',
    alt: 'Mesa larga iluminada con velas y follaje',
    title: 'Una mesa que espera',
    detail: 'Cena familiar',
  },
] as const

export function Gallery() {
  return (
    <section className="gallery" id="galeria">
      <header className="gallery__header">
        <div>
          <span>Momentos reales</span>
          <strong>03 — 04</strong>
        </div>
        <h2>Lo que queda<br /><em>después de la mesa.</em></h2>
        <p>Montajes, encuentros y pequeños gestos que hacen que una celebración se vuelva recuerdo.</p>
      </header>

      <div className="gallery__stage">
        <span className="gallery__ghost" aria-hidden="true">RECUERDOS</span>
        {galleryItems.map((item, index) => (
          <figure className={`gallery-card gallery-card--${index + 1}`} key={item.src}>
            <div className="gallery-card__image">
              <img
                src={`${import.meta.env.BASE_URL}images/gallery/${item.src}`}
                alt={item.alt}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p><strong>{item.title}</strong>{item.detail}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="gallery__note">Fotografías referenciales · Próximamente, historias de Legado</p>
    </section>
  )
}
