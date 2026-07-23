import { useEffect, useState } from 'react'
import { sectionIds, type SectionId } from '../types/navigation'

const reversedSectionIds = [...sectionIds].reverse()
const sectionIdSet = new Set<string>(sectionIds)

function isSectionId(value: string): value is SectionId {
  return sectionIdSet.has(value)
}

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<SectionId>('inicio')

  useEffect(() => {
    let frame = 0

    const syncHash = () => {
      const hash = window.location.hash.slice(1)
      if (isSectionId(hash)) setActiveSection(hash)
    }

    const syncScrollPosition = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const reachedPageEnd =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 24

        if (reachedPageEnd) {
          setActiveSection('contacto')
          return
        }

        const readingLine = window.innerHeight * 0.42
        const currentSection = reversedSectionIds.find((id) => {
            const section = document.getElementById(id)
            return section ? section.getBoundingClientRect().top <= readingLine : false
          })

        if (currentSection) setActiveSection(currentSection)
      })
    }

    window.addEventListener('hashchange', syncHash)
    window.addEventListener('scroll', syncScrollPosition, { passive: true })
    window.addEventListener('resize', syncScrollPosition)
    syncHash()
    syncScrollPosition()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', syncHash)
      window.removeEventListener('scroll', syncScrollPosition)
      window.removeEventListener('resize', syncScrollPosition)
    }
  }, [])

  return activeSection
}
