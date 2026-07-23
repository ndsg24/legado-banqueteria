import { useRef, useState, type PointerEvent, type UIEvent } from 'react'
import { galleryItems } from '../../config/content'
import { EditorialArrow } from '../ui/EditorialArrow'

export function Gallery() {
  const stageRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const scrollToItem = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), galleryItems.length - 1)
    const card = stageRef.current?.querySelector<HTMLElement>(`[data-gallery-index="${nextIndex}"]`)

    card?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }

  const updateActiveItem = (event: UIEvent<HTMLDivElement>) => {
    const stage = event.currentTarget
    const stageCenter = stage.scrollLeft + stage.clientWidth / 2
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    stage.querySelectorAll<HTMLElement>('[data-gallery-index]').forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const distance = Math.abs(stageCenter - cardCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setActiveIndex((currentIndex) => currentIndex === closestIndex ? currentIndex : closestIndex)
  }

  const startDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return

    const stage = event.currentTarget
    dragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: stage.scrollLeft,
    }
    stage.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const dragGallery = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return

    event.preventDefault()
    event.currentTarget.scrollLeft =
      dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX)
  }

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return

    dragRef.current.active = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setIsDragging(false)
  }

  return (
    <section className="gallery" id="galeria">
      <header className="gallery__header">
        <div>
          <span>Días para recordar</span>
          <strong>03 — 04</strong>
        </div>
        <h2>Lo que queda<br /><em>después de la mesa.</em></h2>
        <p>Montajes, encuentros y pequeños gestos que convierten una celebración en recuerdo.</p>
      </header>

      <div
        aria-label="Galería de celebraciones"
        className={`gallery__stage${isDragging ? ' is-dragging' : ''}`}
        onPointerCancel={stopDragging}
        onPointerDown={startDragging}
        onPointerMove={dragGallery}
        onPointerUp={stopDragging}
        onScroll={updateActiveItem}
        ref={stageRef}
        tabIndex={0}
      >
        <span className="gallery__ghost" aria-hidden="true">RECUERDOS</span>
        {galleryItems.map((item, index) => (
          <figure
            className={`gallery-card gallery-card--${index + 1}`}
            data-gallery-index={index}
            key={item.src}
          >
            <div className="gallery-card__image">
              <img
                src={`${import.meta.env.BASE_URL}images/gallery/${item.src}`}
                alt={item.alt}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 760px) 86vw, 34vw"
              />
            </div>
            <figcaption>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p><strong>{item.title}</strong>{item.detail}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="gallery__mobile-nav" aria-label="Controles de la galería">
        <p><em>Desliza</em> para recorrer los recuerdos</p>
        <div className="gallery__progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${(activeIndex + 1) / galleryItems.length})` }} />
        </div>
        <output aria-live="polite">
          <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
          <span> / {String(galleryItems.length).padStart(2, '0')}</span>
        </output>
        <div className="gallery__arrows">
          <button
            aria-label="Ver recuerdo anterior"
            disabled={activeIndex === 0}
            onClick={() => scrollToItem(activeIndex - 1)}
            type="button"
          >
            <EditorialArrow direction="left" />
          </button>
          <button
            aria-label="Ver siguiente recuerdo"
            disabled={activeIndex === galleryItems.length - 1}
            onClick={() => scrollToItem(activeIndex + 1)}
            type="button"
          >
            <EditorialArrow />
          </button>
        </div>
      </div>

      <p className="gallery__note">Fotografías referenciales · Próximamente, historias de Legado</p>
    </section>
  )
}
