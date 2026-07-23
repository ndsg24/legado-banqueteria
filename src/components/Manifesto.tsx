export function Manifesto() {
  return (
    <section className="manifesto">
      <div className="manifesto__image">
        <img src={`${import.meta.env.BASE_URL}images/table-detail.jpg`} alt="Fuente casera servida en una mesa elegante" loading="lazy" />
      </div>
      <div className="manifesto__copy">
        <p className="eyebrow">Nuestra manera</p>
        <blockquote>
          “Que se vea cuidado.<br />
          Que se sienta cercano.<br />
          Que <em>sepa a casa.</em>”
        </blockquote>
        <p>Ese es nuestro punto de partida para cada menú, cada montaje y cada persona que se sienta a la mesa.</p>
      </div>
    </section>
  )
}
