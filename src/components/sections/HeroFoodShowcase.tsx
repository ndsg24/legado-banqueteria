import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { HeroReactions } from './HeroReactions'

const moments = [
  { id: 'encuentro', image: 'table-encuentro-v1', title: 'El primer encuentro', course: '01 / Fresco y natural', detail: 'Ceviche, lino marfil y una copa de blanco.', alt: 'Mesa con mantel de lino marfil, ceviche, cubiertos plateados y vino blanco' },
  { id: 'celebracion', image: 'table-celebracion-v1', title: 'La celebración', course: '02 / Cálido y profundo', detail: 'Medallón de res, azul noche y vino tinto.', alt: 'La misma mesa con mantel azul noche, medallón de res, cubiertos dorados y vino tinto' },
  { id: 'sobremesa', image: 'table-sobremesa-v1', title: 'Una larga sobremesa', course: '03 / Dulce y cercano', detail: 'Tiramisú, rosa antiguo y el último brindis.', alt: 'La misma mesa con mantel rosa antiguo, tiramisú, cucharillas de cobre y copas de espumante' },
] as const

/** Aligned original photographs dissolve gently without resampling or cropping. */
export function HeroFoodShowcase() {
  const root = useRef<HTMLDivElement>(null)
  const previous = useRef<number | null>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const reduced = useReducedMotion()
  const playing = ready && visible && pageVisible && !paused && !reduced

  useEffect(() => {
    if (!root.current) return
    let cancelled = false
    Promise.all(Array.from(root.current.querySelectorAll('img')).map(image => image.decode()))
      .then(() => { if (!cancelled) setReady(true) }).catch(() => {})
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(root.current)
    const change = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', change)
    return () => { cancelled = true; observer.disconnect(); document.removeEventListener('visibilitychange', change) }
  }, [])

  useLayoutEffect(() => {
    if (!root.current) return
    const before = previous.current
    previous.current = active
    if (reduced || before === null || before === active) return
    const context = gsap.context(() => {
      gsap.fromTo('.hero-food__caption', { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.35, ease: 'power2.out' })
    }, root.current)
    return () => context.revert()
  }, [active, reduced])

  useEffect(() => {
    if (!playing) return
    const next = gsap.delayedCall(7, () => setActive(index => (index + 1) % moments.length))
    return () => { next.kill() }
  }, [active, playing])

  const select = (index: number) => { setActive(index); setPaused(false) }

  return (
    <div className="hero-food hero-food--table" ref={root} aria-label="Una mesa realista, tres formas de celebrar">
      <div className="hero-table__scene">
        <div className="hero-table__photos">
          {moments.map((moment, index) => <div key={moment.id} className="hero-table__look" data-active={active === index} aria-hidden={active !== index}>
          <img src={`${import.meta.env.BASE_URL}images/${moment.image}.webp`} srcSet={`${import.meta.env.BASE_URL}images/${moment.image}-720.webp 720w, ${import.meta.env.BASE_URL}images/${moment.image}.webp 1254w`} sizes="(max-width: 760px) calc(100vw - 32px), (min-width: 2200px) 940px, 46vw" width="1254" height="1254" alt={moment.alt} decoding="async" fetchPriority={index === 0 ? 'high' : 'auto'} />
          </div>)}
        </div>
        <HeroReactions kind={active} enabled={playing} />
      </div>
      <div className="hero-food__caption"><span>{moments[active].course}</span><strong>{moments[active].title}</strong><small>{moments[active].detail}</small></div>
      <div className="hero-food__controls" role="group" aria-label="Elegir ambientación de la mesa"><div>{moments.map((moment, index) => <button type="button" key={moment.id} aria-label={`Ver ${moment.title}`} aria-pressed={active === index} onClick={() => select(index)}><span /></button>)}</div><button type="button" onClick={() => setPaused((value) => !value)} disabled={!!reduced || !ready} aria-label={paused || reduced ? 'Reanudar animación de la mesa' : 'Pausar animación de la mesa'}>{paused || reduced ? '▷' : 'Ⅱ'}</button></div>
    </div>
  )
}
