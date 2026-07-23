import { useEffect, useState } from 'react'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Manifesto } from './components/Manifesto'
import { ParallaxDivider } from './components/ParallaxDivider'
import { SectionRail } from './components/SectionRail'
import { Services } from './components/Services'
import { Story } from './components/Story'
import { useActiveSection } from './hooks/useActiveSection'

type Theme = 'light' | 'dark'

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('legado-theme')
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const activeSection = useActiveSection()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('legado-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0a09' : '#f2f2ef')
  }, [theme])

  return (
    <div className="site-shell">
      <Header
        activeSection={activeSection}
        theme={theme}
        onThemeToggle={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
      />
      <SectionRail activeSection={activeSection} />
      <Hero />
      <Story />
      <ParallaxDivider phrase="La sobremesa también es parte del menú." detail="Tiempo para compartir / sin apuro" />
      <Services />
      <ParallaxDivider phrase="Preparar. Servir. Volver a llenar." detail="El gesto que se hereda" variant="dish" />
      <Manifesto />
      <Contact />
      <Footer />
    </div>
  )
}
