import { BackgroundMotifs } from '../../../shared/ui/BackgroundMotifs'
import { Footer, Header, SectionRail } from '../../../widgets/site-layout'
import { Contact } from './Contact'
import { Gallery } from '../../../widgets/gallery'
import { Hero } from './Hero'
import { Manifesto } from './Manifesto'
import { Services } from './Services'
import { Story } from './Story'
import { useActiveSection } from '../model/useActiveSection'
import { useScrollReveal } from '../model/useScrollReveal'
import { useTheme } from '../../../shared/theme'

export function HomePage() {
  const { theme, toggleTheme } = useTheme()
  const { activeSection, headerSection } = useActiveSection()
  useScrollReveal()

  return (
    <div className="site-shell site-texture">
      <Header
        activeSection={activeSection}
        headerSection={headerSection}
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
  )
}
