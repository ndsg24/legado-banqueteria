import type { Theme } from '../../types/theme'

type ThemeToggleProps = {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const nextTheme = theme === 'light' ? 'oscuro' : 'claro'

  return (
    <button className="theme-toggle" type="button" onClick={onToggle} aria-label={`Cambiar a tema ${nextTheme}`}>
      <span className="theme-toggle__label" aria-hidden="true">{theme === 'light' ? 'Día' : 'Noche'}</span>
      <span className="theme-toggle__orbit" aria-hidden="true">
        <i className="theme-toggle__sun">✦</i>
        <i className="theme-toggle__moon">◐</i>
        <i className="theme-toggle__bead" />
      </span>
    </button>
  )
}
