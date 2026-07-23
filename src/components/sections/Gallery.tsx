import { galleryItems } from '../../config/content'

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
