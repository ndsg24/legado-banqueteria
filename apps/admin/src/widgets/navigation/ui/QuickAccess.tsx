import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useI18n } from '@legado/brand/i18n'
import { DialogCloseButton, TextField } from '@legado/brand/controls'
import { workbench } from '../../../shared/config/workbench'
import { messages } from '../../../shared/config/messages'
import { operations } from '../../../shared/config/operations'

import { navigationSections } from '../model/sections'

export function QuickAccess() {
  const { language } = useI18n()
  const c = workbench[language],
    copy = messages[language],
    op = operations[language]
  const dialog = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  function open() {
    setQuery('')
    dialog.current?.showModal()
    dialog.current?.querySelector('input')?.focus()
  }
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (dialog.current?.open) dialog.current.close()
        else open()
      }
    }
    document.addEventListener('keydown', shortcut)
    return () => document.removeEventListener('keydown', shortcut)
  }, [])
  const value = query.trim()
  const normalize = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
  const links: { path: string; label: string }[] = navigationSections(language)
    .flatMap((section) => section.items.map(({ path, label }) => ({ path, label })))
    .filter(({ label }) => normalize(label).includes(normalize(value)))
  if (value) {
    const number = /^#?([1-9]\d{0,17})$/.exec(value)?.[1]
    if (number) links.unshift({ path: '/' + number, label: copy.quote + ' #' + number })
    links.push({
      path: '/quotes?' + new URLSearchParams({ search: number ?? value }),
      label: c.findQuote + ' · ' + value,
    })
  }
  return (
    <>
      <button
        type="button"
        className="nav-toggle quick-trigger"
        aria-label={c.search}
        title={c.search + ' (⌘/Ctrl K)'}
        onClick={open}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <circle cx="10" cy="10" r="6" />
          <path d="m15 15 5 5" />
        </svg>
      </button>
      <dialog ref={dialog} className="quick-dialog" aria-label={c.search}>
        <header>
          <h2>{c.search}</h2>
          <DialogCloseButton label={op.close} onClose={() => dialog.current?.close()} />
        </header>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            dialog.current?.close()
            void navigate(links[0].path)
          }}
        >
          <TextField
            label={c.searchHint}
            type="search"
            maxLength={80}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        <nav aria-label={c.shortcut}>
          {links.map(({ path: to, label }) => (
            <Link key={to} to={to} onClick={() => dialog.current?.close()}>
              {label}
            </Link>
          ))}
        </nav>
      </dialog>
    </>
  )
}
