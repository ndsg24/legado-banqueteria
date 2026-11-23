import { useLoaderData, useSearchParams } from 'react-router'
import { useI18n } from '@legado/brand/i18n'
import type { RecipeBook } from '@legado/domain/operations/recipes'
import { workbench } from '../../../shared/config/workbench'
import { PageHeading } from '../../../shared/ui/PageHeading'
import { libraryDishes, recipeKind, searchTerm } from '../model/library'
import { RecipeIndex } from './RecipeIndex'
import { RecipeWorkspace } from './RecipeWorkspace'
import './library.css'

const pageSize = 12

export function RecipeLibrary() {
  const book = useLoaderData<RecipeBook>()
  const { language, t } = useI18n()
  const c = workbench[language]
  const [params] = useSearchParams()
  const term = searchTerm(params.get('q') ?? '')
  const mode = params.get('kind')
  const matches = libraryDishes.filter(
    (dish) =>
      (!mode || recipeKind(dish.id, book) === mode) && searchTerm(t(dish.name)).includes(term),
  )
  const requested = libraryDishes.find((d) => d.id === params.get('dish'))
  const selectedPage = requested ? Math.floor(matches.indexOf(requested) / pageSize) + 1 : 1
  const pages = Math.max(1, Math.ceil(matches.length / pageSize))
  const page = Math.max(1, Math.min(Math.floor(Number(params.get('page'))) || selectedPage, pages))
  const rows = matches.slice((page - 1) * pageSize, page * pageSize)
  const dish = requested ?? rows[0]
  const back = new URLSearchParams(params)
  back.delete('dish')
  if (page > 1) back.set('page', String(page))
  return (
    <section className="cookbook-view" aria-labelledby="cookbook-title">
      <PageHeading id="cookbook-title" title={c.recipes} titleInNavigation>
        <p>{c.libraryHint}</p>
      </PageHeading>
      <div className="cookbook-layout" data-open={Boolean(requested)} data-empty={!dish}>
        <RecipeIndex
          rows={rows}
          total={matches.length}
          page={page}
          pages={pages}
          book={book}
          activeId={dish?.id}
        />
        {dish && (
          <RecipeWorkspace
            key={dish.id}
            dish={dish}
            book={book}
            back={'?' + back}
            explicit={Boolean(requested)}
          />
        )}
      </div>
    </section>
  )
}
