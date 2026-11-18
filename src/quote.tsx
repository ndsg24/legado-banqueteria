import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QuotePage } from './pages/QuotePage'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QuotePage />
  </StrictMode>,
)
