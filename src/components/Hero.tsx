export function Hero() {
  return (
    <main id="inicio" className="hero">
      <div className="hero__meta">
        <p>Banquetería familiar</p>
        <p>Santiago de Chile</p>
        <p>Desde nuestra casa</p>
      </div>

      <div className="hero__word" aria-label="Legado">
        <span>LE</span>
        <span>GA</span>
        <span>DO</span>
      </div>

      <figure className="hero__memory hero__memory--main">
        <img src={`${import.meta.env.BASE_URL}images/hero-table.jpg`} alt="Mesa abundante con preparaciones caseras para compartir" />
        <figcaption>Una mesa. Muchas historias.</figcaption>
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
