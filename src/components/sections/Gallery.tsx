import { useLayoutEffect, useRef, useState, type CSSProperties, type UIEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { galleryItems } from '../../config/content'
import { EditorialArrow } from '../ui/EditorialArrow'
import { RingLines } from '../decorative/BackgroundMotifs'

gsap.registerPlugin(ScrollTrigger)

const sketchPaths = {
  stars: 'M34 13q0 19 15 21-15 1-18 19 0-17-14-20 14-2 17-20ZM62 7q1 10 9 11-9 2-10 11-1-9-8-11 8-1 9-11ZM66 39l3 4m6-12 5 1M14 55l-4 4',
  citrus: 'M12 43q15-15 43-28c11 23 3 40-13 46-12 5-24 0-30-18Zm6 0c9 13 19 16 28 10 12-7 14-17 8-32ZM39 33l-1 17m6-20 8 9m-19-1-8 5M58 14q7-12 21-9-6 12-21 9Z',
  toast: 'm14 13 21 5-6 17q-3 8-11 5t-6-12Zm6 28-5 13m-8-2 16 4m-8-30 16 4m17-12 21-6 3 17q2 9-6 12t-12-6Zm15 24 5 12m-9 3 16-5m-22-20 16-5M41 5l1 7m-9-8 3 5m13-6-3 6',
  candle: 'M28 53V30q6 2 14 0v23m-15 1q8 3 16-1m-8-23v-6m0 0c-8-3-5-10 2-16 0 6 6 12-2 16Zm13 28V38q5 2 10 0v13m-5-13v-4c-6-2-3-8 1-12 1 5 4 8-1 12ZM17 54q13 13 47-1m-43 7q17 7 38 0',
  leaves: 'M10 57q33-10 58-48M24 51Q12 42 15 30q15 4 13 19m8-6q14-2 23 4-12 10-23-4Zm8-8q-10-11-4-23 11 7 6 21Zm9-9q13-9 23-4-11 11-23 4Zm9-13q0-9 10-12 0 8-10 12Z',
} as const

function PhotoSketch({ motif }: { motif: keyof typeof sketchPaths }) {
  return <svg className={`photo-sketch photo-sketch--${motif}`} viewBox="0 0 84 68" fill="none" aria-hidden="true" focusable="false">
    <path d={sketchPaths[motif]} />
  </svg>
}

function PhotoAlbum({ startIndex, onClose }: { startIndex: number; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [stack, setStack] = useState([startIndex])
  const wheel = useRef({ last: 0, distance: 0, turned: false })
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const opened = stack[0]
  const item = galleryItems[opened]

  useLayoutEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal()
  }, [])

  const turnPhoto = (direction: number) => {
    setStack(previous => {
      const next = (previous[0] + direction + galleryItems.length) % galleryItems.length
      return [next, ...previous.filter(index => index !== next)]
    })
  }

  return (
    <dialog className="memory-viewer" ref={dialog} aria-label="Álbum de celebraciones"
      onClose={onClose}
      onWheel={event => {
        if (event.ctrlKey) return
        const print = event.currentTarget.querySelector('figure')
        if (print && print.scrollHeight > print.clientHeight + 1) return
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
        if (!delta) return
        const gesture = wheel.current
        const now = performance.now()
        if (now - gesture.last > 180 || Math.sign(delta) !== Math.sign(gesture.distance)) {
          gesture.distance = 0
          gesture.turned = false
        }
        gesture.last = now
        gesture.distance += delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1)
        if (!gesture.turned && Math.abs(gesture.distance) >= 36) {
          gesture.turned = true
          turnPhoto(Math.sign(gesture.distance))
        }
      }}
      onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}
      onKeyDown={event => {
        if (event.key === 'ArrowRight') turnPhoto(1)
        if (event.key === 'ArrowLeft') turnPhoto(-1)
      }}>
      <div className="memory-viewer__stack" style={{ '--photo-ratio': item.width / item.height } as CSSProperties}>
        {stack.slice(1).map((index, depth) => {
          const photo = galleryItems[index]
          return <div key={index} aria-hidden="true" className="instant-print-back" data-depth={depth + 1}
            style={{ '--photo-ratio': photo.width / photo.height } as CSSProperties}>
            <img alt="" src={`${import.meta.env.BASE_URL}images/gallery/${photo.src}`} width={photo.width} height={photo.height} />
            <div className="instant-print-back__caption">
              <small>{String(index + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')} · {photo.detail}</small>
              <h3>{photo.title}.</h3>
            </div>
          </div>
        })}
        <figure className="instant-print">
          <div className="instant-print__image"
            onPointerDown={event => {
              if (event.pointerType === 'mouse') return
              swipe.current = event.isPrimary ? { x: event.clientX, y: event.clientY } : null
            }}
            onPointerCancel={() => { swipe.current = null }}
            onPointerUp={event => {
              const start = swipe.current
              swipe.current = null
              if (!start || !event.isPrimary) return
              const dx = start.x - event.clientX
              const dy = start.y - event.clientY
              const distance = Math.abs(dx) > Math.abs(dy) ? dx : dy
              if (Math.abs(distance) >= 45) turnPhoto(Math.sign(distance))
            }}>
            <img key={item.src} src={`${import.meta.env.BASE_URL}images/gallery/${'fullSrc' in item ? item.fullSrc : item.src}`} alt={item.alt} width={item.width} height={item.height} />
            <PhotoSketch motif={item.sketch} />
          </div>
          <figcaption>
            <div aria-live="polite" aria-atomic="true">
              <small>{String(opened + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')} · {item.detail}</small>
              <h3>{item.title}.</h3>
            </div>
          </figcaption>
        </figure>
        <button className="memory-viewer__close" type="button" autoFocus aria-label="Cerrar imagen" onClick={() => dialog.current?.close()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <div className="memory-viewer__navigation" role="group" aria-label="Navegación de fotos">
        <button type="button" aria-label="Imagen anterior" onClick={() => turnPhoto(-1)}><EditorialArrow direction="left" /></button>
        <button type="button" aria-label="Imagen siguiente" onClick={() => turnPhoto(1)}><EditorialArrow direction="right" /></button>
      </div>
    </dialog>
  )
}

export function Gallery() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const [active, setActive] = useState(0)
  const [opened, setOpened] = useState<number | null>(null)

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
  }

  return <section className="gallery gallery--editorial" id="galeria" ref={root} aria-labelledby="gallery-title">
    <div className="gallery__motifs" aria-hidden="true">
      <svg className="gallery__garland" viewBox="0 0 320 112" focusable="false">
        <path d="M-8 5Q132 128 328 14" />
        <g fill="currentColor" stroke="none">
          <circle cx="37" cy="37" r="3" /><circle cx="90" cy="58" r="3" /><circle cx="150" cy="68" r="3" /><circle cx="217" cy="61" r="3" /><circle cx="279" cy="40" r="3" />
        </g>
        <path d="m90 67 0 5m-6-7-3 4m15-4 3 4m118 1v5m-7-7-3 4m16-4 3 4" />
      </svg>
      <svg className="gallery__sprig" viewBox="0 0 150 210" focusable="false">
        <path d="M9 202Q75 150 116 20M30 182Q25 153 40 125Q55 159 30 182ZM52 153Q81 121 102 127Q85 152 52 153ZM72 121Q52 101 62 72Q82 91 72 121ZM88 89Q103 60 136 60Q120 84 88 89ZM103 55Q89 32 106 9Q117 32 103 55Z" />
      </svg>
      <svg className="gallery__plate" viewBox="0 0 220 220" focusable="false"><RingLines /></svg>
    </div>
    <header className="gallery__header">
      <div><span>Días para recordar</span><strong>03 — 04</strong></div>
      <h2 id="gallery-title">Lo que queda<br /><em>después de la mesa.</em></h2>
      <p><span>Una mesa se prepara. Un recuerdo se queda.</span><small>Acércate a los detalles <EditorialArrow direction="up-right" /></small></p>
    </header>
    <div className="memories" ref={stage} onScroll={track} aria-label="Galería de celebraciones" tabIndex={0}>
      {galleryItems.map((photo, index) => <figure className={`memory memory--${index + 1}`} data-memory={index} key={photo.src}>
        <button className="memory__open" type="button" aria-label={`Ampliar: ${photo.title}`} onClick={event => open(index, event.currentTarget)}>
          <img src={`${import.meta.env.BASE_URL}images/gallery/${photo.src}`} srcSet={'srcSet' in photo ? photo.srcSet.split(', ').map(source => `${import.meta.env.BASE_URL}images/gallery/${source}`).join(', ') : undefined} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" sizes={index === 0 ? "(max-width: 760px) 82vw, (min-width: 1980px) 1250px, 65vw" : "(max-width: 760px) 82vw, (min-width: 1980px) 1130px, 60vw"} />
          <PhotoSketch motif={photo.sketch} />
          <span className="memory__discover" aria-hidden="true">Mirar de cerca <EditorialArrow direction="up-right" /></span>
        </button>
        <figcaption><span>0{index + 1}</span><div><small>{photo.detail}</small><h3>{photo.title}.</h3></div><span aria-hidden="true"><EditorialArrow direction="up-right" /></span></figcaption>
      </figure>)}
      <aside className="memories__aside"><span aria-hidden="true">✦</span><p>Los mejores momentos<br /><em>no tienen prisa.</em></p><small>Sentarse. Compartir. Quedarse.</small></aside>
    </div>
    <div className="memories__nav"><span><em>Desliza</em> y quédate un rato.</span><output aria-live="polite">0{active + 1} / 05</output><button type="button" aria-label="Ver recuerdo anterior" disabled={active === 0} onClick={() => scrollTo(active - 1)}><EditorialArrow direction="left" /></button><button type="button" aria-label="Ver siguiente recuerdo" disabled={active === 4} onClick={() => scrollTo(active + 1)}><EditorialArrow direction="right" /></button></div>
    <p className="gallery__note">Fotografías referenciales · Próximamente, historias de Legado</p>
    {opened !== null && <PhotoAlbum startIndex={opened} onClose={() => {
      setOpened(null)
      opener.current?.focus({ preventScroll: true })
    }} />}

  </section>
}
