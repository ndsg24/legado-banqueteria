import { siteConfig } from '../../config/site'
import { EditorialArrow } from '../ui/EditorialArrow'

export function Contact() {
  return (
    <section className="contact" id="contacto">
      <div className="contact__index">
        <span>Tu celebración</span>
        <strong>04 — 04</strong>
      </div>
      <p className="contact__pretitle">Si ya sabes a quién quieres invitar,</p>
      <h2>nosotros sabemos<br /><em>cómo reunirlos.</em></h2>
      <p>Fecha, número de invitados y una idea. Con eso basta para comenzar.</p>
      <div className="contact__actions">
        <a className="button button--gold" href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer">
          <span>Conversemos por WhatsApp</span><i><EditorialArrow direction="up-right" /></i>
        </a>
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </div>
    </section>
  )
}
