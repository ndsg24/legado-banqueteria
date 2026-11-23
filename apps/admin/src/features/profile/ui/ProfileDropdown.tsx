import { useState } from 'react'
import { ActionButton, usePickerDisclosure } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import { messages } from '../../../shared/config/messages'
import { signOut, type Profile } from '../../../entities/session'
import './profile.css'

function Account({ profile }: { profile: Profile }) {
  const words = profile.displayName.split(/[\s._-]+/u).filter(Boolean)
  const initials = [words[0], words.length > 1 ? words.at(-1) : undefined]
    .filter(Boolean)
    .map((word) => Array.from(word!)[0])
    .join('')
    .toLocaleUpperCase()
  return (
    <span className="admin-account">
      <span className="admin-avatar" aria-hidden="true">
        {initials || '•'}
      </span>
      <span className="account-identity">
        <strong>{profile.displayName}</strong>
        <small>{profile.email}</small>
      </span>
    </span>
  )
}

export function ProfileDropdown({ profile }: { profile: Profile }) {
  const { trigger, disclosure } = usePickerDisclosure()
  const copy = messages[useI18n().language]
  const [logoutError, setLogoutError] = useState(false)
  const [ending, setEnding] = useState(false)
  async function logout() {
    if (ending) return
    setLogoutError(false)
    setEnding(true)
    try {
      const result = await signOut()
      if (result.ok) {
        location.replace('/admin/login')
        return
      }
    } catch {
      /* show the retryable failure in the same menu */
    }
    setLogoutError(true)
    setEnding(false)
  }
  return (
    <details
      className="profile-dropdown"
      {...disclosure}
      onToggle={(event) => {
        if (!event.currentTarget.open) setLogoutError(false)
      }}
    >
      <summary
        className="profile-trigger"
        ref={trigger}
        aria-label={copy.profile + ' · ' + profile.displayName}
      >
        <Account profile={profile} />
        <svg
          className="profile-chevron"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      <div className="profile-options">
        <span className="profile-email">{profile.email}</span>
        {logoutError && (
          <p role="alert" className="auth-error">
            {copy.serviceError}
          </p>
        )}
        <ActionButton variant="secondary" onPress={logout} aria-disabled={ending}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 4H4v16h5m-1-8h13m-5-5 5 5-5 5" />
          </svg>
          {copy.signOut}
        </ActionButton>
      </div>
    </details>
  )
}
