import { PageTransition } from './providers/PageTransition'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { Layout, RouteError } from './routing/layout'
import { LanguageProvider } from '../shared/i18n'
import './styles/index.css'

const loadHome = async () => ({ Component: (await import('./routing/HomeRoute')).HomeRoute })

const router = createBrowserRouter(
  [
    {
      Component: Layout,
      ErrorBoundary: RouteError,
      HydrateFallback: () => null,
      children: [
        { index: true, lazy: loadHome },
        { path: 'index.html', lazy: loadHome },
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
    <PageTransition router={router} />
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  </StrictMode>,
)
