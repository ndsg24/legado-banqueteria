import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CatalogPage } from './pages/CatalogPage'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CatalogPage />
  </StrictMode>,
)
