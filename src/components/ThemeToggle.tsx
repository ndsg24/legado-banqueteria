type ThemeToggleProps = {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const nextTheme = theme === 'light' ? 'oscuro' : 'claro'

  return (
    <button className="theme-toggle" type="button" onClick={onToggle} aria-label={`Cambiar a tema ${nextTheme}`}>
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb">
          {theme === 'light' ? '☼' : '☾'}
        </span>
      </span>
      <span className="theme-toggle__label">{theme === 'light' ? 'Claro' : 'Oscuro'}</span>
    </button>
  )
}
