import type { LoaderFunctionArgs } from 'react-router'
import type { RecipeBook } from '@legado/domain/operations/recipes'
import type { ApiQuoteDetail } from '@legado/domain/quote/wire'
import { readAdminApi } from '../../../shared/api'

export async function loadQuoteDossier({ params, request }: LoaderFunctionArgs) {
  const { signal } = request
  const quote: ApiQuoteDetail = await readAdminApi(
    'quotes/' + encodeURIComponent(params.number!),
    signal,
  )
  let book: RecipeBook | null = {}
  if (Object.values(quote.payload.items).some((quantity) => quantity > 0)) {
    try {
      book = await readAdminApi('recipes', signal)
    } catch (error) {
      if (signal.aborted || (error instanceof Response && error.status === 401)) throw error
      book = null
    }
  }
  return { quote, book }
}
