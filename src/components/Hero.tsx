export function Hero() {
  return (
    <main id="inicio" className="hero">
      <div className="hero__copy">
        <p className="eyebrow">Cocina que reúne · Santiago de Chile</p>
        <h1>
          El sabor de casa,
          <em>a la altura de tu celebración.</em>
        </h1>
        <p className="hero__intro">
          Recetas generosas, ingredientes escogidos y una atención cercana para esos días que merecen quedarse en la memoria.
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href="#contacto">Cuéntanos tu idea <span>↗</span></a>
          <a className="text-link" href="#servicios">Conoce lo que hacemos <span>↓</span></a>
        </div>
      </div>
      <figure className="hero__image">
        <img src={`${import.meta.env.BASE_URL}images/hero-table.jpg`} alt="Mesa abundante con preparaciones caseras para compartir" />
        <figcaption>
          <span>01</span>
          <p><strong>Preparado con tiempo.</strong> Servido con cariño.</p>
        </figcaption>
      </figure>
      <p className="hero__side-note" aria-hidden="true">Desde nuestra familia · Para la tuya</p>
    </main>
  )
}
