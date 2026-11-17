import { Brand } from './Brand'

type FooterProps = { homeHref?: string; topHref?: string }

export function Footer({ homeHref = '#inicio', topHref = '#inicio' }: FooterProps) {
  return (
    <footer>
      <Brand href={homeHref} />
      <p>Comida hecha por personas,<br />para personas.</p>
      <div>
        <a href={topHref}>Volver arriba ↑</a>
        <span>© {new Date().getFullYear()} Legado</span>
      </div>
    </footer>
  )
}
