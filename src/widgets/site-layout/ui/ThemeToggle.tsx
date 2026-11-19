import { useI18n } from '../../../shared/i18n'
import type { Theme } from '../../../shared/theme'

type ThemeToggleProps = {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const { t } = useI18n()

  const nextTheme = theme === 'light' ? 'common.theme.switchDark' : 'common.theme.switchLight'

  return (
    <button className="theme-toggle" type="button" onClick={onToggle} aria-label={t(nextTheme)}>
      <span className="theme-toggle__label" aria-hidden="true">
        {theme === 'light' ? t('common.theme.day') : t('common.theme.night')}
      </span>
      <span className="theme-toggle__orbit" aria-hidden="true">
        <i className="theme-toggle__sun">✦</i>
        <i className="theme-toggle__moon">◐</i>
        <i className="theme-toggle__bead" />
      </span>
    </button>
  )
}
