import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TablePage } from './pages/TablePage'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TablePage />
  </StrictMode>,
)
