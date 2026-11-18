import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'

/** Covers only same-site document navigation; anchors and external actions stay native. */
export function PageTransition() {
  useLayoutEffect(() => {
    const overlay = document.querySelector<HTMLElement>('.page-transition')
    if (!overlay) return
    const root = document.documentElement
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let navigating = false
    let entrance: gsap.core.Timeline | undefined
    let destination: URL | undefined
    let cancelled = false
    const markAnimations: gsap.core.Animation[] = []
    const context = gsap.context(() => {}, overlay)
    const reset = () => {
      navigating = false
      entrance?.kill()
      markAnimations.splice(0).forEach(animation => animation.kill())
      delete root.dataset.pageTransition
      gsap.set(overlay, { clearProps: 'all' })
    }
    const animateMark = () => context.add(() => {
      if (reduced) return
      markAnimations.splice(0).forEach(animation => animation.kill())
      markAnimations.push(gsap.to('.page-transition__orbit', { strokeDashoffset: -452.4, duration: 2.6, repeat: -1, ease: 'none' }))
      const path = overlay.querySelector<SVGPathElement>('.page-transition__draw')
      if (path) markAnimations.push(gsap.fromTo(path, { strokeDasharray: path.getTotalLength(), strokeDashoffset: path.getTotalLength() }, { strokeDashoffset: 0, duration: .7, ease: 'power2.out' }))
      markAnimations.push(gsap.fromTo('.page-transition__steam', { y: 4, opacity: .2 }, { y: -3, opacity: .8, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' }))
    })
    if (root.dataset.pageTransition === 'pending') {
      animateMark()
      // Let the destination mount and fonts settle without waiting for off-screen images.
      Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 800))]).then(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (cancelled) return
          context.add(() => {
            gsap.to(overlay, { autoAlpha: 0, duration: reduced ? .1 : .45, delay: reduced ? 0 : .15, ease: 'power2.inOut', onComplete: reset })
          })
        }))
      })
    }
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return
      const url = new URL(anchor.href, location.href)
      if (url.origin !== location.origin || !url.pathname.startsWith(import.meta.env.BASE_URL) || url.pathname === location.pathname) return
      if (!['/', '/index.html', '/carta.html', '/ambientacion.html'].includes('/' + url.pathname.slice(import.meta.env.BASE_URL.length))) return
      event.preventDefault()
      if (navigating) return
      navigating = true
      destination = url
      try { sessionStorage.setItem('legado-navigation', JSON.stringify({ path: url.pathname, time: Date.now() })) } catch { /* Navigation still works without storage. */ }
      overlay.style.pointerEvents = 'auto'
      animateMark()
      context.add(() => {
        entrance = gsap.timeline({ onComplete: () => { if (destination) location.assign(destination.href) } })
          .to(overlay, { autoAlpha: 1, duration: reduced ? .08 : .25, ease: 'power2.out' })
          .to({}, { duration: reduced ? 0 : .4 })
      })
    }
    const restore = (event: PageTransitionEvent) => { if (event.persisted) reset() }
    document.addEventListener('click', click)
    window.addEventListener('pageshow', restore)
    return () => {
      cancelled = true
      document.removeEventListener('click', click)
      window.removeEventListener('pageshow', restore)
      context.revert()
    }
  }, [])
  return null
}
