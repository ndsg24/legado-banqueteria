import { BackgroundMotifs } from '../components/decorative/BackgroundMotifs'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { SectionRail } from '../components/layout/SectionRail'
import { Contact } from '../components/sections/Contact'
import { Gallery } from '../components/sections/Gallery'
import { Hero } from '../components/sections/Hero'
import { Manifesto } from '../components/sections/Manifesto'
import { Services } from '../components/sections/Services'
import { Story } from '../components/sections/Story'
import { useActiveSection } from '../hooks/useActiveSection'
import { useInitialHash } from '../hooks/useInitialHash'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useTheme } from '../hooks/useTheme'
import { AppMotionProvider } from './AppMotionProvider'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const activeSection = useActiveSection()
  useScrollReveal()
  useInitialHash()

  return (
    <AppMotionProvider>
      <div className="site-shell">
        <Header
          activeSection={activeSection}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
        <SectionRail activeSection={activeSection} />
        <main>
          <Hero />
          <div className="content-canvas">
            <BackgroundMotifs />
            <Story />
            <Services />
            <Gallery />
            <Manifesto />
            <Contact />
          </div>
        </main>
        <Footer />
      </div>
    </AppMotionProvider>
  )
}
