import { useEffect } from 'react'

const revealSelector = [
  '.story__title',
  '.story__body',
  '.service',
  '.gallery__header',
  '.gallery-card',
  '.manifesto__image',
  '.manifesto__copy',
  '.contact__pretitle',
  '.contact h2',
  '.contact__actions',
].join(',')

export function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector))

    elements.forEach((element, index) => {
      element.classList.add('reveal-item')
      element.style.setProperty('--reveal-order', String(index % 5))
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}
