import { useLayoutEffect, useRef, useState, type UIEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { galleryItems } from '../../config/content'
import { EditorialArrow } from '../ui/EditorialArrow'

gsap.registerPlugin(ScrollTrigger)

export function Gallery() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const [active, setActive] = useState(0)
  const [opened, setOpened] = useState(0)
  const item = galleryItems[opened]

  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.memory').forEach(card => {
          gsap.from(card, { y: 45, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 95%', once: true } })
        })
      }, root)
      return () => context.revert()
    })
    return () => media.revert()
  }, [])

  const scrollTo = (index: number) => {
    const card = stage.current?.querySelector<HTMLElement>(`[data-memory="${index}"]`)
    if (card && stage.current) stage.current.scrollTo({ left: card.offsetLeft - stage.current.offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  const track = (event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    const cards = Array.from(element.querySelectorAll<HTMLElement>('[data-memory]'))
    const closest = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - element.offsetLeft - element.scrollLeft) < Math.abs(cards[best].offsetLeft - element.offsetLeft - element.scrollLeft) ? index : best, 0)
    setActive(closest)
  }
  const open = (index: number, button: HTMLButtonElement) => {
    opener.current = button
    setOpened(index)
    dialog.current?.showModal()
  }

  return <section className="gallery gallery--editorial" id="galeria" ref={root} aria-labelledby="gallery-title">
    <header className="gallery__header">
      <div><span>Días para recordar</span><strong>03 — 04</strong></div>
      <h2 id="gallery-title">Lo que queda<br /><em>después de la mesa.</em></h2>
      <p><span>Una mesa se prepara. Un recuerdo se queda.</span><small>Acércate a los detalles ↗</small></p>
    </header>
    <div className="memories" ref={stage} onScroll={track} aria-label="Galería de celebraciones" tabIndex={0}>
      {galleryItems.map((photo, index) => <figure className={`memory memory--${index + 1}`} data-memory={index} key={photo.src}>
        <button className="memory__open" type="button" aria-label={`Ampliar: ${photo.title}`} onClick={event => open(index, event.currentTarget)}>
          <img src={`${import.meta.env.BASE_URL}images/gallery/${photo.src}`} srcSet={'srcSet' in photo ? photo.srcSet.split(', ').map(source => `${import.meta.env.BASE_URL}images/gallery/${source}`).join(', ') : undefined} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" sizes={index === 0 ? "(max-width: 760px) 82vw, (min-width: 1980px) 1250px, 65vw" : "(max-width: 760px) 82vw, (min-width: 1980px) 1130px, 60vw"} />
          <span className="memory__discover" aria-hidden="true">Mirar de cerca <EditorialArrow direction="up-right" /></span>
        </button>
        <figcaption><span>0{index + 1}</span><div><small>{photo.detail}</small><h3>{photo.title}.</h3></div><span aria-hidden="true">↗</span></figcaption>
      </figure>)}
      <aside className="memories__aside"><span aria-hidden="true">✦</span><p>Los mejores momentos<br /><em>no tienen prisa.</em></p><small>Sentarse. Compartir. Quedarse.</small></aside>
    </div>
    <div className="memories__nav"><span><em>Desliza</em> y quédate un rato.</span><output aria-live="polite">0{active + 1} / 05</output><button type="button" aria-label="Ver recuerdo anterior" disabled={active === 0} onClick={() => scrollTo(active - 1)}>←</button><button type="button" aria-label="Ver siguiente recuerdo" disabled={active === 4} onClick={() => scrollTo(active + 1)}>→</button></div>
    <p className="gallery__note">Fotografías referenciales · Próximamente, historias de Legado</p>
    <dialog className="memory-viewer" ref={dialog} aria-label="Recuerdos de una celebración" onClose={() => opener.current?.focus({ preventScroll: true })} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }} onKeyDown={event => { if (event.key === 'ArrowRight') setOpened(index => (index + 1) % galleryItems.length); if (event.key === 'ArrowLeft') setOpened(index => (index + galleryItems.length - 1) % galleryItems.length) }}>
      <button className="memory-viewer__close" type="button" aria-label="Cerrar imagen" onClick={() => dialog.current?.close()}>Cerrar ×</button>
      <img key={item.src} src={`${import.meta.env.BASE_URL}images/gallery/${'fullSrc' in item ? item.fullSrc : item.src}`} alt={item.alt} width={item.width} height={item.height} />
      <div className="memory-viewer__footer"><button type="button" aria-label="Imagen anterior" onClick={() => setOpened(index => (index + 4) % 5)}>←</button><div aria-live="polite"><small>0{opened + 1} / 05 · {item.detail}</small><h3>{item.title}.</h3></div><button type="button" aria-label="Imagen siguiente" onClick={() => setOpened(index => (index + 1) % 5)}>→</button></div>
    </dialog>
  </section>
}
