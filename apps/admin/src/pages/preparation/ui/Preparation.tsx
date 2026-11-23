import { dispatchLabels } from '../model/labels'
import { PreparationMenu } from './PreparationMenu'
import { ShoppingList } from './ShoppingList'
import { usePreparationSheet } from '../../../entities/preparation'
import { Link, useLoaderData, useLocation } from 'react-router'
import { useI18n } from '@legado/brand/i18n'
import { ActionButton, ActionLink } from '@legado/brand/controls'
import { fromApiQuote, type ApiQuoteDetail } from '@legado/domain/quote/wire'
import { preparationPlan } from '@legado/domain/operations/preparation'
import { dietaryDetails } from '@legado/domain/quote/review'
import { EventTicket, QuoteTableDetail } from '../../../entities/quotes'
import { operations } from '../../../shared/config/operations'
import type { RecipeBook } from '@legado/domain/operations/recipes'
import { messages } from '../../../shared/config/messages'
import './preparation.css'

export function Preparation() {
  const { quote, book } = useLoaderData<{ quote: ApiQuoteDetail; book: RecipeBook }>()
  return <EventPlan key={quote.number} quote={quote} book={book} />
}
function EventPlan({ quote, book }: { quote: ApiQuoteDetail; book: RecipeBook }) {
  const { language, t } = useI18n()
  const c = operations[language],
    copy = messages[language]
  const labels = dispatchLabels[language]
  const data = fromApiQuote(quote.payload)
  const { sheet, setSheet } = usePreparationSheet(quote.number)
  const { packs, loaded } = sheet
  const listState = useLocation().state as { pathname?: string; search?: string } | null
  const backPath = listState?.pathname === '/calendar' ? '/calendar' : '/preparation'
  const plan = preparationPlan(data, book)
  const missing = plan.dishes.filter((dish) => dish.pending && dish.servings > 0)
  const dietary = dietaryDetails(data, t)
  return (
    <section className="ops-page preparation-page">
      <Link className="back" to={{ pathname: backPath, search: listState?.search }}>
        {backPath === '/calendar' ? copy.calendar : c.prep}
      </Link>
      <EventTicket quote={data} number={quote.number}>
        <ActionLink variant="secondary" to={'/' + quote.number}>
          {copy.quote}
        </ActionLink>
        <ActionLink variant="secondary" to={'/finance?quoteNumber=' + quote.number}>
          {c.finance}
        </ActionLink>
        <ActionButton variant="secondary" onPress={() => window.print()}>
          {c.print}
        </ActionButton>
      </EventTicket>
      {missing.length > 0 && (
        <section className="admin-surface dispatch-missing">
          <h2>
            {labels.missingRecipes} · {missing.length}
          </h2>
          <ul>
            {missing.map((dish) => (
              <li key={dish.id}>
                <Link to={'/recipes?dish=' + encodeURIComponent(dish.id) + '#recipe-detail'}>
                  {t(dish.name)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="preparation-bento">
        <PreparationMenu quote={data} dishes={plan.dishes} />
        {(data.table || dietary || data.notes) && (
          <aside className="preparation-setting">
            {data.table && (
              <QuoteTableDetail design={data.table} guests={data.guests} showPreview />
            )}
            {(dietary || data.notes) && (
              <section className="admin-surface op-panel">
                {dietary && (
                  <>
                    <h2>{t('quote.review.dietaryNeeds')}</h2>
                    <p className="op-note">{dietary}</p>
                  </>
                )}
                {data.notes && (
                  <>
                    <h2>{t('quote.review.comments')}</h2>
                    <p>{data.notes}</p>
                  </>
                )}
              </section>
            )}
          </aside>
        )}
        <ShoppingList
          number={quote.number}
          completeRecipes={!missing.length}
          resources={plan.resources}
          packs={packs}
          loaded={loaded}
          onCheck={(id, token) =>
            setSheet((prev) => {
              const next = { ...prev.loaded }
              if (token === null) delete next[id]
              else next[id] = token
              return { ...prev, loaded: next }
            })
          }
          onPack={(id, value) =>
            setSheet((prev) => ({ ...prev, packs: { ...prev.packs, [id]: value } }))
          }
          onReset={() => setSheet({ packs: {}, loaded: {} })}
        />
      </div>
    </section>
  )
}
