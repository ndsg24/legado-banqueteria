import { m } from 'framer-motion'
import { siteConfig } from '../../config/site'
import { EditorialArrow } from '../ui/EditorialArrow'

export function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero__meta">
        <p>Banquetería familiar</p>
        <p>{siteConfig.location}</p>
        <p>Desde nuestra casa</p>
      </div>

      <h1 className="hero__word" id="hero-title" aria-label="Legado">
        <span data-letter="LE">LE</span>
        <span data-letter="GA">GA</span>
        <span data-letter="DO">DO</span>
      </h1>

      <div className="hero__echoes" aria-hidden="true">
        {[0, 1].map((echo) => (
          <div className="hero__echo-row" key={echo}>
            <span>LE</span>
            <span>GA</span>
            <span>DO</span>
          </div>
        ))}
      </div>

      <figure className="hero__memory hero__memory--main">
        <m.img
          src={`${import.meta.env.BASE_URL}images/hero-table.jpg`}
          alt="Mesa familiar servida con platos caseros para compartir"
          width={1800}
          height={1200}
          fetchPriority="high"
          decoding="async"
          sizes="(max-width: 760px) calc(100vw - 28px), min(920px, 62vw)"
          animate={{ scale: [1.02, 1.075, 1.02], x: [0, -8, 0] }}
          transition={{ duration: 15, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY }}
        />
        <figcaption>La mesa está servida.</figcaption>
      </figure>

      <div className="hero__statement">
        <p>
          Cocina casera para días
          <em> que no se repiten.</em>
        </p>
        <a href="#contacto" aria-label="Cotizar una celebración">
          <span>Cotiza tu celebración</span>
          <i><EditorialArrow direction="up-right" /></i>
        </a>
      </div>

      <div className="hero__scroll">
        <span>Desliza para sentarte a la mesa</span>
        <i />
      </div>

      <div className="hero__gold-orbit" aria-hidden="true">
        <svg viewBox="0 0 800 160" preserveAspectRatio="none">
          <defs>
            <linearGradient
              id="orbit-shimmer"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="180"
              y2="0"
            >
              <stop offset="0" stopColor="var(--gold-hot)" stopOpacity="0" />
              <stop offset=".42" stopColor="var(--gold-hot)" stopOpacity=".18" />
              <stop offset=".58" stopColor="var(--gold-hot)" stopOpacity="1" />
              <stop offset="1" stopColor="var(--gold-hot)" stopOpacity="0" />
              <animate
                attributeName="gradientTransform"
                values="translate(-220 0); translate(1020 0)"
                dur="7.5s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
          <path className="hero__gold-orbit-base" d="M-40 124C155 22 645 22 840 124" />
          <path className="hero__gold-orbit-shine" d="M-40 124C155 22 645 22 840 124" />
        </svg>
      </div>
    </section>
  )
}
