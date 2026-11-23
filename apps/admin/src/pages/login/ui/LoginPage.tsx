import { PageTransition } from '@legado/brand/page-transition'
import { useState, type KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import { DottedTexture } from '@legado/brand/dotted-texture'
import { useI18n } from '@legado/brand/i18n'
import { ActionButton, Brand, TextField } from '@legado/brand/controls'
import photo480 from '../../../../../web/public/images/hero-place-settings/floral-480.avif?url'
import photo800 from '../../../../../web/public/images/hero-place-settings/floral-800.avif?url'
import photo1600 from '../../../../../web/public/images/hero-place-settings/floral-1600.avif?url'
import { Preferences } from '../../../features/preferences'
import { messages } from '../../../shared/config/messages'
import { signIn, type Credentials } from '../../../entities/session'
import { loginDestination, loginHints } from './destination'
import './login.css'

export function Login() {
  const { language, t } = useI18n()
  const copy = messages[language]
  const destination = loginDestination(location.search, language)
  const hints = loginHints[language]
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Credentials>()
  const [visible, setVisible] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [error, setError] = useState<'loginError' | 'serviceError' | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const password = register('password', { onBlur: () => setCapsLock(false) })
  function checkCapsLock(event: KeyboardEvent<HTMLInputElement>) {
    setCapsLock(event.getModifierState('CapsLock'))
  }
  async function submit(data: Credentials) {
    setError(null)
    try {
      const res = await signIn(data)
      if (res.ok) {
        setRedirecting(true)
        location.replace(destination.href)
        return
      }
      setError(res.status === 401 ? 'loginError' : 'serviceError')
    } catch {
      setRedirecting(false)
      setError('serviceError')
    }
  }
  return (
    <main className="login-spread">
      <PageTransition pending={isSubmitting || redirecting} />
      <div className="login-photo photo-grain">
        <img
          src={photo800}
          srcSet={`${photo480} 480w, ${photo800} 800w, ${photo1600} 1600w`}
          sizes="(max-width: 700px) 100vw, 50vw"
          alt=""
          fetchPriority="high"
        />
        <div className="login-signature" data-tone="dark">
          <Brand href={'/login' + location.search} />
        </div>
      </div>
      <div className="login-settings">
        <Preferences />
      </div>
      <div className="login-panel table-watermark">
        <DottedTexture />
        <form onSubmit={handleSubmit(submit)} aria-busy={isSubmitting}>
          <header>
            <p className="login-context">{copy.admin}</p>
            <h1>{copy.signIn}</h1>
            {destination.label && (
              <p className="login-destination">
                {hints.destination} <strong>{destination.label}</strong>
              </p>
            )}
          </header>
          <TextField
            icon="email"
            label={t('quote.review.email')}
            {...register('email')}
            type="email"
            autoComplete="username"
            placeholder={t('quote.form.emailPlaceholder')}
            maxLength={254}
            required
          />
          <div className="login-secret">
            <TextField
              icon="password"
              label={copy.password}
              {...password}
              onKeyDown={checkCapsLock}
              onKeyUp={checkCapsLock}
              type={visible ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder={copy.passwordHint}
              maxLength={512}
              required
            />
            <button
              type="button"
              className="password-visibility"
              onClick={() => setVisible(!visible)}
              aria-pressed={visible}
              aria-label={visible ? copy.hidePassword : copy.showPassword}
            >
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="2.8" />
                {visible && <path d="m3 3 18 18" />}
              </svg>
            </button>
          </div>
          <p className="login-caps" role="status" aria-live="polite">
            {capsLock && hints.caps}
          </p>
          {error && (
            <p role="alert" className="auth-error">
              {copy[error]}
            </p>
          )}
          <ActionButton type="submit" isDisabled={isSubmitting || redirecting}>
            {copy.signIn}
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M4 12h15m-6-6 6 6-6 6" />
            </svg>
          </ActionButton>
        </form>
      </div>
    </main>
  )
}
