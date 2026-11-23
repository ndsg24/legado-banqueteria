import { RouterPageTransition } from '@legado/brand/page-transition'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, replace } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { Layout, RouteError } from './routing/layout'
import { LanguageProvider } from '../shared/i18n'
import { ideasPath, isIdeasPreview, tableIdeaHref } from '../shared/config/tableIdea'
import './styles/index.css'

const loadHome = async () => ({ Component: (await import('./routing/HomeRoute')).HomeRoute })

const router = createBrowserRouter(
  [
    {
      Component: Layout,
      ErrorBoundary: RouteError,
      HydrateFallback: () => null,
      children: [
        { path: ideasPath, loader: () => replace(tableIdeaHref('dorada')) },
        ...(isIdeasPreview
          ? [{ path: 'ideas-de-la-casa', loader: () => replace(tableIdeaHref('dorada')) }]
          : []),
        { index: true, lazy: loadHome },
        { path: 'index.html', lazy: loadHome },
        {
          path: 'privacidad.html',
          lazy: async () => ({ Component: (await import('../pages/privacy')).PrivacyPage }),
        },
        {
          path: 'carta.html',
          lazy: async () => ({ Component: (await import('../pages/catalog')).CatalogPage }),
        },
        {
          path: 'ambientacion.html',
          lazy: async () => ({ Component: (await import('../pages/table')).TablePage }),
        },
        {
          path: 'cotizar.html',
          lazy: async () => ({ Component: (await import('../pages/quote')).QuotePage }),
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <RouterPageTransition router={router} />
      <RouterProvider router={router} />
    </LanguageProvider>
  </StrictMode>,
)
