import { Brand } from './Brand'
import { ThemeToggle } from './ThemeToggle'

type HeaderProps = {
  theme: 'light' | 'dark'
  onThemeToggle: () => void
}

export function Header({ theme, onThemeToggle }: HeaderProps) {
  return (
    <header className="site-header">
      <Brand />
      <nav aria-label="Navegación principal">
        <a href="#historia">Nuestra historia</a>
        <a href="#servicios">Servicios</a>
        <a href="#contacto">Contacto</a>
      </nav>
      <ThemeToggle theme={theme} onToggle={onThemeToggle} />
    </header>
  )
}
