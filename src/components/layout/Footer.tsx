import { Brand } from './Brand'

export function Footer() {
  return (
    <footer>
      <Brand />
      <p>Comida hecha por personas,<br />para personas.</p>
      <div>
        <a href="#inicio">Volver arriba ↑</a>
        <span>© {new Date().getFullYear()} Legado</span>
      </div>
    </footer>
  )
}
