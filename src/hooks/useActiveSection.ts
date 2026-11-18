import { useEffect, useState } from 'react'
import { sectionIds, type SectionId } from '../types/navigation'

const reversedSectionIds = [...sectionIds].reverse()
const sectionIdSet = new Set<string>(sectionIds)

function isSectionId(value: string): value is SectionId {
  return sectionIdSet.has(value)
}

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<SectionId>('inicio')

  const [headerSection, setHeaderSection] = useState<SectionId>('inicio')

  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header')
    const sections = reversedSectionIds.flatMap(id => {
      const element = document.getElementById(id)
      return element ? [{ id, element }] : []
    })
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

        const positions = sections.map(({ id, element }) => ({ id, top: element.getBoundingClientRect().top }))
        const sectionAt = (line: number) => positions.find(section => section.top <= line)?.id ?? 'inicio'
        setHeaderSection(sectionAt((header?.offsetHeight ?? 0) + 1))
        setActiveSection(reachedPageEnd ? 'contacto' : sectionAt(window.innerHeight * 0.42))
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

  return { activeSection, headerSection }
}
