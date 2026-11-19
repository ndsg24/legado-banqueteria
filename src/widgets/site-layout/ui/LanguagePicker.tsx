import { useEffect, useRef, useState } from 'react'
import { languages, useI18n, type Language } from '../../../shared/i18n'

import chile from 'flag-icons/flags/4x3/cl.svg?no-inline'
import usa from 'flag-icons/flags/4x3/us.svg?no-inline'
import france from 'flag-icons/flags/4x3/fr.svg?no-inline'
import brazil from 'flag-icons/flags/4x3/br.svg?no-inline'

const flags = { es: chile, en: usa, fr: france, pt: brazil } satisfies Record<Language, string>

function Flag({ language }: { language: Language }) {
  return (
    <img className="language-picker__flag" src={flags[language]} width="24" height="18" alt="" />
  )
}

export function LanguagePicker() {
  const { language, t, changeLanguage } = useI18n()
  const panel = useRef<HTMLDetailsElement>(null)
  const trigger = useRef<HTMLElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (panel.current && event.target instanceof Node && !panel.current.contains(event.target))
        panel.current.open = false
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [])

  function close() {
    if (panel.current) panel.current.open = false
    trigger.current?.focus()
  }

  async function choose(next: Language) {
    setError(false)
    try {
      await changeLanguage(next)
      close()
    } catch {
      setError(true)
    }
  }

  return (
    <details
      className="language-picker"
      ref={panel}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.open = false
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') close()
      }}
    >
      <summary ref={trigger} aria-label={t('common.language.label') + ': ' + languages[language]}>
        <Flag language={language} />
        <span>{language.toUpperCase()}</span>
        <svg
          className="language-picker__chevron"
          viewBox="0 0 12 12"
          width="12"
          height="12"
          aria-hidden="true"
        >
          <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
        </svg>
      </summary>
      <div
        className="language-picker__options"
        role="group"
        aria-label={t('common.language.label')}
      >
        <div className="language-picker__heading" aria-hidden="true">
          {t('common.language.label')}
        </div>
        {(Object.keys(languages) as Language[]).map((code) => (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={code === language}
            onClick={() => void choose(code)}
          >
            <Flag language={code} />
            <span>{languages[code]}</span>
            {code === language && (
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="m3 8 3.1 3.2L13 4.7" />
              </svg>
            )}
          </button>
        ))}
        {error && <small role="alert">{t('common.language.loadError')}</small>}
      </div>
    </details>
  )
}
