import { AppMotionProvider } from '../app/AppMotionProvider'
import { PagePath } from '../components/layout/PagePath'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { TableConfigurator } from '../components/table/TableConfigurator'
import { useTheme } from '../hooks/useTheme'
import '../styles/table.css'

export function TablePage() {
  const { theme, toggleTheme } = useTheme()
  const homeHref = `${import.meta.env.BASE_URL}#inicio`
  return <AppMotionProvider><div className="site-shell site-texture table-page"><Header activeSection="ambientacion" theme={theme} onThemeToggle={toggleTheme} /><main><PagePath href={`${import.meta.env.BASE_URL}carta.html`} backLabel="Volver a la carta" current="Tu mesa" /><TableConfigurator /></main><Footer homeHref={homeHref} topHref="#disena" /></div></AppMotionProvider>
}
