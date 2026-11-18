import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import type { RefObject } from 'react'

export function useHeroExperience(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    const media = gsap.matchMedia(element)
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      intro.from('.living-hero__line > span', { yPercent: 115, rotation: 3, opacity: 0, duration: 1.3, stagger: 0.13 }, 0.15)
      const firstPhoto = element.querySelector<HTMLImageElement>('.hero-table__look[data-active="true"] img')
      const tableEntrance = gsap.from('.hero-food', {
        y: 18, opacity: 0, duration: 1.3, ease: 'power3.out', paused: true, clearProps: 'opacity,transform',
      })
      const revealTable = () => { tableEntrance.play() }
      intro.call(() => {
        if (!firstPhoto || firstPhoto.complete) revealTable()
        else {
          firstPhoto.addEventListener('load', revealTable, { once: true })
          firstPhoto.addEventListener('error', revealTable, { once: true })
        }
      }, [], 0.15)
      intro.from('.hero__meta, .living-hero__eyebrow', { y: 12, opacity: 0, duration: 1, stagger: 0.12 }, 0.2)
      intro.from('.living-hero__description, .living-hero__actions', { y: 18, opacity: 0, duration: 1, stagger: 0.15 }, 0.7)
      intro.from('.hero__signature', { opacity: 0, duration: 1.8 }, 0.4)
      intro.from('.hero__scroll', { opacity: 0, duration: 0.6 }, 1.2)
      const glint = gsap.timeline({ delay: 2.6, repeat: -1, repeatDelay: 6 })
      element.querySelectorAll('.hero__signature-trace').forEach((letter, index) => {
        const start = index * 2.4
        glint.fromTo(letter, { strokeDashoffset: 8 }, { strokeDashoffset: -100, duration: 3, ease: 'none' }, start)
          .fromTo(letter, { opacity: 0 }, { opacity: .26, duration: .9, ease: 'sine.inOut' }, start)
          .to(letter, { opacity: 0, duration: 1, ease: 'sine.inOut' }, start + 2)
      })
      const cue = gsap.timeline({ repeat: -1, repeatDelay: 0.6 })
        .fromTo('.hero__scroll i b', { x: 0, opacity: 0 }, { x: 30, opacity: 1, duration: 1.1, ease: 'power2.inOut' })
        .to('.hero__scroll i b', { opacity: 0, duration: 0.3 })
      const arrow = gsap.fromTo('.hero__scroll-cue', { y: -2, opacity: 0.45 }, { y: 4, opacity: 1, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      const update = () => {
        const rect = element.getBoundingClientRect()
        const playing = !document.hidden && rect.bottom > 0 && rect.top < innerHeight
        glint.paused(!playing)
        cue.paused(!playing)
        arrow.paused(!playing)
      }
      const observer = new IntersectionObserver(update)
      observer.observe(element)
      document.addEventListener('visibilitychange', update)
      return () => {
        observer.disconnect()
        document.removeEventListener('visibilitychange', update)
        firstPhoto?.removeEventListener('load', revealTable)
        firstPhoto?.removeEventListener('error', revealTable)
      }
    })
    return () => media.revert()
  }, [root])
}
