import { useEffect, useState } from 'react'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Manifesto } from './components/Manifesto'
import { SectionRail } from './components/SectionRail'
import { Services } from './components/Services'
import { Story } from './components/Story'
import { useActiveSection } from './hooks/useActiveSection'
import { useScrollReveal } from './hooks/useScrollReveal'

type Theme = 'light' | 'dark'

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('legado-theme')
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const activeSection = useActiveSection()
  useScrollReveal()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('legado-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a0a09' : '#f2f2ef')
  }, [theme])

  useEffect(() => {
    const initialHash = window.location.hash
    if (!initialHash) return

    const initialTarget = document.querySelector<HTMLElement>(initialHash)
    initialTarget?.scrollIntoView()
  }, [])

  return (
    <div className="site-shell">
      <Header
        activeSection={activeSection}
        theme={theme}
        onThemeToggle={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
      />
      <SectionRail activeSection={activeSection} />
      <Hero />
      <div className="content-canvas">
        <Story />
        <Services />
        <Gallery />
        <Manifesto />
        <Contact />
      </div>
      <Footer />
    </div>
  )
}
