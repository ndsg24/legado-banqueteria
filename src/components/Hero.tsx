import { m } from 'framer-motion'

export function Hero() {
  return (
    <main id="inicio" className="hero">
      <div className="hero__meta">
        <p>Banquetería familiar</p>
        <p>Concepción, Chile</p>
        <p>Desde nuestra casa</p>
      </div>

      <div className="hero__word" aria-label="Legado">
        <span data-letter="LE">LE</span>
        <span data-letter="GA">GA</span>
        <span data-letter="DO">DO</span>
      </div>

      <figure className="hero__memory hero__memory--main">
        <m.img
          src={`${import.meta.env.BASE_URL}images/hero-table.jpg`}
          alt="Mesa familiar servida con platos caseros para compartir"
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
          <i>↗</i>
        </a>
      </div>

      <div className="hero__scroll">
        <span>Desliza para sentarte a la mesa</span>
        <i />
      </div>

      <div className="hero__gold-orbit" aria-hidden="true">
        <svg viewBox="0 0 800 440" preserveAspectRatio="none">
          <path d="M-40 390C98 220 198 503 369 285 516 97 591 67 847 93" />
          <circle cx="369" cy="285" r="5" />
        </svg>
      </div>
    </main>
  )
}
