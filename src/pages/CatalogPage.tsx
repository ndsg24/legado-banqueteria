import { AppMotionProvider } from '../app/AppMotionProvider'
import { CatalogExperience } from '../components/catalog/CatalogExperience'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { useTheme } from '../hooks/useTheme'
import '../styles/catalog.css'

export function CatalogPage() {
  const { theme, toggleTheme } = useTheme()
  const homeHref = `${import.meta.env.BASE_URL}#inicio`

  return (
    <AppMotionProvider>
      <div className="site-shell catalog-page site-texture">
        <Header activeSection="carta" theme={theme} onThemeToggle={toggleTheme} />
        <main>
          <a className="catalog-page__back" href={homeHref}>← Volver a Legado</a>
          <CatalogExperience />
        </main>
        <Footer homeHref={homeHref} topHref="#carta" />
      </div>
    </AppMotionProvider>
  )
}
