import { useEffect, useRef } from 'react'
import { Link, useRevalidator } from 'react-router'
import { useI18n } from '@legado/brand/i18n'
import type { RecipeBook } from '@legado/domain/operations/recipes'
import { RecipeEditor } from '../../../features/recipe-editor'
import { catalogPhoto } from '../../../shared/config/catalog-photo'
import { workbench } from '../../../shared/config/workbench'
import { libraryLabels, recipeKind, type LibraryDish } from '../model/library'

type Props = { dish: LibraryDish; book: RecipeBook; back: string; explicit: boolean }

export function RecipeWorkspace({ dish, book, back, explicit }: Props) {
  const { language, t } = useI18n()
  const { revalidate } = useRevalidator()
  const photo = catalogPhoto(dish.imageThumbnail)
  const heading = useRef<HTMLHeadingElement>(null)
  const returnLink = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    if (explicit && returnLink.current?.getClientRects().length) heading.current?.focus()
  }, [explicit])
  const kind = recipeKind(dish.id, book)
  return (
    <section id="recipe-detail" className="cookbook-open" aria-labelledby="recipe-name">
      <Link ref={returnLink} to={back} className="recipe-return">
        <span className="recipe-chevron recipe-chevron-back" aria-hidden="true" />
        {libraryLabels[language].back}
      </Link>
      <div className="recipe-edit-pane admin-surface">
        <header className="recipe-title-block">
          <div>
            <div className="recipe-meta">
              <span>{t(dish.group)}</span>
              <span className="recipe-status" data-state={kind}>
                {workbench[language][kind]}
              </span>
            </div>
            <h2 ref={heading} tabIndex={-1} id="recipe-name">
              {t(dish.name)}
            </h2>
            <p>{t(dish.description)}</p>
          </div>
          {photo && <img src={photo} width="96" height="80" alt="" decoding="async" />}
        </header>
        <RecipeEditor id={dish.id} book={book} onSaved={() => void revalidate()} />
      </div>
    </section>
  )
}
