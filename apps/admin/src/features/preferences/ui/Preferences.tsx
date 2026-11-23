import { LanguageOptions, ThemeOptions, usePickerDisclosure } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { useTheme } from '@legado/brand/theme'
import { adminThemeKey } from '../../../shared/config/theme'
import './preferences.css'
import { messages } from '../../../shared/config/messages'

export function Preferences() {
  const { language } = useI18n()
  const { theme, setTheme } = useTheme(adminThemeKey)
  const { trigger, disclosure } = usePickerDisclosure()
  const label = messages[language].settings
  return (
    <details className="admin-settings" {...disclosure}>
      <summary className="nav-toggle" ref={trigger} aria-label={label} title={label}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path
            d={
              'm9.5 3-.6 2.4-1.5.9-2.4-.7-2.1 3.7 1.8 1.7v2l-1.8 1.7L5 18.4l2.4-.7 1.5.9.6 2.4h5' +
              'l.6-2.4 1.5-.9 2.4.7 2.1-3.7-1.8-1.7v-2l1.8-1.7L19 5.6l-2.4.7-1.5-.9-.6-2.4z'
            }
          />
          <circle cx="12" cy="12" r="3.3" />
        </svg>
      </summary>
      <div className="admin-settings-panel" data-sample={theme}>
        <h2>{label}</h2>
        <div className="language-picker">
          <LanguageOptions />
        </div>
        <div className="theme-toggle">
          <ThemeOptions theme={theme} onChange={setTheme} />
        </div>
      </div>
    </details>
  )
}
