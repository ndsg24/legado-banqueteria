type ThemeToggleProps = {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const nextTheme = theme === 'light' ? 'oscuro' : 'claro'

  return (
    <button className="theme-toggle" type="button" onClick={onToggle} aria-label={`Cambiar a tema ${nextTheme}`}>
      <span aria-hidden="true">{theme === 'light' ? 'Luz' : 'Noche'}</span>
      <i aria-hidden="true" />
    </button>
  )
}
