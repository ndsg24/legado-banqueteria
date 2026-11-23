import './styles.css'
import './operations.css'
import { initializeTheme } from '@legado/brand/theme'
import { adminThemeKey } from '../shared/config/theme'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router'
import type { ApiQuoteDetail } from '@legado/domain/quote/wire'
import { LanguageProvider } from '@legado/brand/i18n'
import { loadDossierView, loadQuoteDossier, updateQuoteStatus } from '../pages/quote-detail'
import { Shell } from './Shell'
import { RouterPageTransition } from '@legado/brand/page-transition'
import { Failure } from './RouteFeedback'
import { readAdminApi } from '../shared/api'
import { loadDashboard, loadDashboardView } from '../pages/dashboard'
import { EventCalendar, loadCalendar } from '../pages/event-calendar'
import { History } from '../pages/quote-history'

initializeTheme(adminThemeKey)

const router = createBrowserRouter(
  [
    {
      element: <Shell />,
      loader: ({ request }) => readAdminApi('profile', request.signal),
      HydrateFallback: () => null,
      errorElement: <Failure />,
      children: [
        {
          id: 'dashboard',
          index: true,
          lazy: loadDashboardView,
          loader: loadDashboard,
          errorElement: <Failure />,
        },
        {
          path: 'purchasing',
          lazy: () => import('../pages/purchasing'),
          errorElement: <Failure />,
        },
        {
          path: 'recipes',
          lazy: () => import('../pages/recipe-library'),
          loader: ({ request }) => readAdminApi('recipes', request.signal),
          shouldRevalidate: ({ currentUrl, nextUrl, formMethod, defaultShouldRevalidate }) =>
            currentUrl.pathname === nextUrl.pathname &&
            currentUrl.search !== nextUrl.search &&
            (!formMethod || formMethod === 'GET')
              ? false
              : defaultShouldRevalidate,
          errorElement: <Failure />,
        },
        {
          path: 'content',
          lazy: () => import('../pages/catalog-review'),
          errorElement: <Failure />,
        },
        {
          path: 'finance',
          lazy: () => import('../pages/finance'),
          loader: ({ request }) =>
            readAdminApi('ledger?' + new URL(request.url).searchParams, request.signal),
          errorElement: <Failure />,
        },
        {
          path: 'preparation/:number',
          lazy: () => import('../pages/preparation'),
          loader: async ({ params, request }) => {
            const quote: ApiQuoteDetail = await readAdminApi(
              'quotes/' + encodeURIComponent(params.number!),
              request.signal,
            )
            if (quote.status !== 'confirmed') throw redirect('/' + quote.number)
            const book = await readAdminApi('recipes', request.signal)
            return { quote, book }
          },
          errorElement: <Failure />,
        },
        {
          path: 'calendar',
          element: <EventCalendar />,
          loader: loadCalendar,
          errorElement: <Failure />,
        },
        ...(['quotes', 'preparation'] as const).map((path) => ({
          path,
          element: <History preparation={path === 'preparation'} />,
          errorElement: <Failure />,
          loader: ({ request }: { request: Request }) => {
            const params = new URL(request.url).searchParams
            if (!params.has('pageSize')) params.set('pageSize', '5')
            if (path === 'preparation') params.set('status', 'confirmed')
            return readAdminApi('quotes?' + params, request.signal)
          },
        })),
        {
          path: ':number',
          action: updateQuoteStatus,
          lazy: loadDossierView,
          loader: loadQuoteDossier,
          errorElement: <Failure />,
        },
      ],
    },
  ],
  { basename: '/admin' },
)

createRoot(document.getElementById('root')!).render(
  <LanguageProvider storageKey="legado-admin-language">
    <RouterPageTransition router={router} includeDataUpdates />
    <RouterProvider router={router} />
  </LanguageProvider>,
)
