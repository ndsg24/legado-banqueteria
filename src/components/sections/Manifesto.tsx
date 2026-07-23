export function Manifesto() {
  return (
    <section className="manifesto" id="manera">
      <div className="manifesto__ticker" aria-hidden="true">
        <span>Casero no significa simple</span>
        <i>✦</i>
        <span>Casero significa nuestro</span>
      </div>
      <div className="manifesto__image">
        <img
          src={`${import.meta.env.BASE_URL}images/table-detail.jpg`}
          alt="Fuente de comida casera servida al centro de una mesa"
          width="1600"
          height="2000"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 760px) 100vw, 50vw"
        />
        <span>Fuente al centro / como debe ser</span>
      </div>
      <div className="manifesto__copy">
        <span>Nuestra manera</span>
        <h2>Alta calidad.<br />Cero distancia.</h2>
        <p>
          No queremos platos que haya que explicar. Queremos ver fuentes que se vacían, conversaciones que se alargan y personas que preguntan quién cocinó.
        </p>
      </div>
    </section>
  )
}
