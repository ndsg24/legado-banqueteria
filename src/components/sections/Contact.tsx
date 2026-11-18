import { quoteHref } from '../../quote/selection'
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
      <p>Cuéntanos qué estás organizando en Concepción. Puedes escribirnos directamente o reunir los detalles en una solicitud de cotización.</p>
      <div className="contact__actions">
        <a className="button button--gold" href={quoteHref()}><span>Solicitar cotización</span><EditorialArrow direction="up-right" /></a>
        {siteConfig.whatsappUrl && <a href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer">Conversemos por WhatsApp</a>}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </div>
    </section>
  )
}
