import { HeroFoodShowcase } from './HeroFoodShowcase'
import { useRef } from 'react'
import { useHeroExperience } from '../../hooks/useHeroExperience'
import { siteConfig } from '../../config/site'
import { EditorialArrow } from '../ui/EditorialArrow'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  useHeroExperience(root)
  return (
    <section id="inicio" className="hero hero--living site-texture" ref={root} aria-labelledby="hero-title">
      <svg className="hero__signature" viewBox="0 0 1600 300" aria-hidden="true"><text x="800" y="258" textAnchor="middle" textLength="1540" lengthAdjust="spacingAndGlyphs" fill="#080808" stroke="#f6edc9" strokeWidth="1" strokeLinejoin="round" paintOrder="stroke fill">LEGADO</text></svg>
      <div className="hero__meta"><p>Banquetería familiar</p><p>{siteConfig.location}</p><p>Comida hecha para reunir</p></div>
      <div className="living-hero__layout">
      <div className="living-hero__content">
        <p className="living-hero__eyebrow"><span aria-hidden="true" />De nuestra casa a tu celebración</p>
        <h1 id="hero-title"><span className="living-hero__line"><span>Hay mesas</span></span><span className="living-hero__line"><span>que se quedan</span></span><span className="living-hero__line living-hero__line--serif"><span><em>contigo.</em></span></span></h1>
        <p className="living-hero__description">La comida se comparte.<br />Lo que vivimos alrededor, se queda.</p>
        <div className="living-hero__actions"><a href="#contacto">Imaginemos tu celebración <EditorialArrow direction="up-right" /></a><a href={`${import.meta.env.BASE_URL}carta.html`}>Descubre la carta <EditorialArrow direction="up-right" /></a></div>
      </div>
      <HeroFoodShowcase />
      </div>
      <a className="hero__scroll" href="#historia" aria-label="Desliza para sentarte a la mesa. Conoce nuestra historia"><span>Desliza para sentarte a la mesa</span><i aria-hidden="true"><b /></i><span className="hero__scroll-cue" aria-hidden="true">↓</span></a>
    </section>
  )
}
