import { Brand } from './Brand'

export function Footer() {
  return (
    <footer>
      <Brand />
      <p>Banquetería familiar · Santiago, Chile</p>
      <div>
        <a href="#inicio">Volver arriba ↑</a>
        <span>© {new Date().getFullYear()} Legado</span>
      </div>
    </footer>
  )
}
