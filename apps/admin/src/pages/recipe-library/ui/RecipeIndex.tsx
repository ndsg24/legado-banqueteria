import { useEffect, useRef } from 'react'
import { Form, Link, useSearchParams } from 'react-router'
import { ActionButton, TextField, NativeSelect } from '@legado/brand/controls'
import { useI18n } from '@legado/brand/i18n'
import type { RecipeBook } from '@legado/domain/operations/recipes'
import { catalogPhoto } from '../../../shared/config/catalog-photo'
import { messages } from '../../../shared/config/messages'
import { workbench } from '../../../shared/config/workbench'
import { libraryLabels, recipeKind, recipeKinds, type LibraryDish } from '../model/library'

type Props = {
  rows: LibraryDish[]
  total: number
  page: number
  pages: number
  book: RecipeBook
  activeId?: string
}

export function RecipeIndex({ rows, total, page, pages, book, activeId }: Props) {
  const { language, locale, t } = useI18n()
  const c = workbench[language]
  const copy = messages[language]
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const kind = params.get('kind') ?? ''
  const explicitId = params.get('dish')
  const lastId = useRef(explicitId)
  const list = useRef<HTMLUListElement>(null)
  useEffect(() => {
    if (lastId.current && !explicitId) {
      const row = Array.from(list.current?.querySelectorAll('a') ?? []).find(
        (link) => link.dataset.dish === lastId.current,
      )
      if (row && getComputedStyle(row).visibility !== 'hidden') row.focus({ preventScroll: true })
    }
    lastId.current = explicitId
  }, [explicitId])
  function linkTo(key: 'dish' | 'page', value: string) {
    const next = new URLSearchParams(params)
    if (key === 'page') next.delete('dish')
    next.set(key, value)
    return '?' + next
  }
  return (
    <section className="recipe-index admin-surface" aria-labelledby="recipe-index-heading">
      <header className="recipe-index-head">
        <h2 id="recipe-index-heading">{libraryLabels[language].index}</h2>
        <span>{total.toLocaleString(locale)}</span>
      </header>
      <Form className="recipe-index-tools" key={JSON.stringify([q, kind])} role="search">
        <div className="recipe-search-row">
          <TextField
            label={c.recipeSearch}
            labelClassName="recipe-visually-hidden"
            type="search"
            name="q"
            placeholder={c.recipeSearch}
            defaultValue={q}
          />
          <ActionButton type="submit" variant="secondary" aria-label={copy.apply}>
            <svg
              aria-hidden="true"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
          </ActionButton>
        </div>
        <label className="recipe-filter">
          <span>{c.recipeFilter}</span>
          <NativeSelect
            name="kind"
            defaultValue={kind}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
          >
            <option value="">{c.all}</option>
            {recipeKinds.map((k) => (
              <option key={k} value={k}>
                {c[k]}
              </option>
            ))}
          </NativeSelect>
        </label>
      </Form>
      {rows.length ? (
        <ul ref={list} className="recipe-index-list">
          {rows.map((dish, index) => {
            const state = recipeKind(dish.id, book)
            const photo = catalogPhoto(dish.imageThumbnail)
            return (
              <li key={dish.id}>
                {rows[index - 1]?.group !== dish.group && (
                  <h3 className="recipe-group-name">{t(dish.group)}</h3>
                )}
                <Link
                  to={linkTo('dish', dish.id)}
                  className="cookbook-card"
                  data-dish={dish.id}
                  aria-current={activeId === dish.id ? 'true' : undefined}
                  preventScrollReset
                >
                  <span className="recipe-index-thumb">
                    {photo && (
                      <img
                        src={photo}
                        alt=""
                        width="56"
                        height="48"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </span>
                  <span className="recipe-index-copy">
                    <strong>{t(dish.name)}</strong>
                    <small className="recipe-status" data-state={state}>
                      {c[state]}
                    </small>
                  </span>
                  <span className="recipe-chevron" aria-hidden="true" />
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="recipe-index-empty" role="status">
          <p>{c.noDishes}</p>
          <Link to="/recipes">{copy.clear}</Link>
        </div>
      )}
      {pages > 1 && (
        <nav className="recipe-index-pager" aria-label={copy.page}>
          {page > 1 && (
            <Link aria-label={copy.previous} to={linkTo('page', String(page - 1))}>
              <span className="recipe-chevron recipe-chevron-back" aria-hidden="true" />
            </Link>
          )}
          <span>
            {page.toLocaleString(locale)} / {pages.toLocaleString(locale)}
          </span>
          {page < pages && (
            <Link aria-label={copy.next} to={linkTo('page', String(page + 1))}>
              <span className="recipe-chevron" aria-hidden="true" />
            </Link>
          )}
        </nav>
      )}
    </section>
  )
}
