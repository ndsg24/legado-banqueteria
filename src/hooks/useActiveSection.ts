import { useEffect, useState } from 'react'

const sectionIds = ['inicio', 'historia', 'servicios', 'manera', 'contacto'] as const

export type SectionId = (typeof sectionIds)[number]

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<SectionId>('inicio')

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const nextSection = visible[0]?.target.id as SectionId | undefined
        if (nextSection) setActiveSection(nextSection)
      },
      {
        rootMargin: '-22% 0px -54% 0px',
        threshold: [0, 0.1, 0.35, 0.65],
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return activeSection
}
