import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import { gsap } from 'gsap'

export function useCatalogIntro(headerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (!headerRef.current) return
    const media = gsap.matchMedia(headerRef.current)
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      timeline.from('[data-intro-meta]', { autoAlpha: 0, y: 10, duration: 0.65 }, 0)
      timeline.from(
        '[data-title-line]',
        { yPercent: 112, rotate: 2, duration: 1.15, stagger: 0.12 },
        0.12,
      )
      timeline.from('[data-intro-copy]', { autoAlpha: 0, y: 22, duration: 0.9 }, 0.55)
    })
    return () => media.revert()
  }, [headerRef])
}
