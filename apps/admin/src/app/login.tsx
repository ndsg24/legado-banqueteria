import './styles.css'
import { initializeTheme } from '@legado/brand/theme'
import { adminThemeKey } from '../shared/config/theme'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { LanguageProvider } from '@legado/brand/i18n'
import { Login } from '../pages/login'

try {
  sessionStorage.removeItem('legado-admin-preparation-v1')
} catch {
  /* The browser can disable session storage. */
}
initializeTheme(adminThemeKey)

createRoot(document.getElementById('root')!).render(
  <LanguageProvider storageKey="legado-admin-language">
    <BrowserRouter basename="/admin">
      <Login />
    </BrowserRouter>
  </LanguageProvider>,
)
