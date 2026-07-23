import { useEffect, useState } from 'react'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Manifesto } from './components/Manifesto'
import { Services } from './components/Services'
import { Story } from './components/Story'

type Theme = 'light' | 'dark'

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('legado-theme')
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('legado-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#121310' : '#f5f1e8')
  }, [theme])

  return (
    <>
      <Header theme={theme} onThemeToggle={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} />
      <Hero />
      <Story />
      <Services />
      <Manifesto />
      <Contact />
      <Footer />
    </>
  )
}
