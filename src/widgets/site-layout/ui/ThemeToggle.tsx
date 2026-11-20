import { useI18n } from '../../../shared/i18n'
import { themes, type Theme } from '../../../shared/theme'
import { usePickerDisclosure } from '../model/usePickerDisclosure'

const labels = {
  light: 'common.theme.day',
  dark: 'common.theme.night',
  garden: 'common.theme.garden',
  pool: 'common.theme.pool',
} as const

export function ThemeToggle({
  theme,
  onChange,
}: {
  theme: Theme
  onChange: (value: Theme) => void
}) {
  const { t } = useI18n()
  const { close, trigger, disclosure } = usePickerDisclosure()
  const label = t('common.theme.label')

  return (
    <details className="theme-toggle" {...disclosure}>
      <summary ref={trigger} aria-label={label + ': ' + t(labels[theme])}>
        <span data-sample={theme} className="theme-toggle__chip" aria-hidden="true" />
        {t(labels[theme])}
      </summary>
      <div role="group" aria-label={label} className="theme-toggle__options">
        <span className="theme-toggle__title" aria-hidden="true">
          {label}
        </span>
        {themes.map((value) => (
          <button
            type="button"
            key={value}
            aria-pressed={value === theme}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onChange(value)
              close()
            }}
          >
            <span className="theme-toggle__sample" data-sample={value} aria-hidden="true" />
            <span className="theme-toggle__name">{t(labels[value])}</span>
          </button>
        ))}
      </div>
    </details>
  )
}
