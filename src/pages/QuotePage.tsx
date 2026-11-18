import { AppMotionProvider } from '../app/AppMotionProvider'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { PagePath } from '../components/layout/PagePath'
import QuoteForm from '../components/sections/QuoteForm'
import { useTheme } from '../hooks/useTheme'
import '../styles/quote.css'

export function QuotePage() {
  const { theme, toggleTheme } = useTheme()
  const home = import.meta.env.BASE_URL
  return (
    <AppMotionProvider>
      <div className="site-shell site-texture">
        <Header activeSection="cotizar" theme={theme} onThemeToggle={toggleTheme} />
        <main id="cotizar" className="quote-page">
          <PagePath
            href={home + '#contacto'}
            backLabel="Volver a Conversemos"
            current="Cotización"
          />
          <div className="quote-layout">
            <header className="quote-intro">
              <h1>
                Cotiza tu <em>celebración.</em>
              </h1>
              <p>
                Cuéntanos dónde se reunirán y cuántas personas esperas. Puedes sumar tus favoritos
                de la carta o dejar que te propongamos el menú.
              </p>
            </header>
            <QuoteForm />
          </div>
        </main>
        <Footer homeHref={home + '#inicio'} topHref="#cotizar" />
      </div>
    </AppMotionProvider>
  )
}
