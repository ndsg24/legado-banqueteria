import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'

/** Runs decorative timelines only while their section and the document are visible. */
export function useEditorialMotion(
  root: RefObject<HTMLElement | null>,
  kind: 'ribbon' | 'story' | 'manifesto',
) {
  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const animations: gsap.core.Animation[] = []
      let hovered = false
      let visible = false
      let resize: ResizeObserver | undefined
      const context = gsap.context(() => {
        if (kind === 'ribbon') {
          const track = element.querySelector<HTMLElement>('.ribbon__track')
          if (!track) return
          const flow = gsap.fromTo(
            track,
            { xPercent: 0 },
            { xPercent: -50, duration: 40, repeat: -1, ease: 'none', paused: true },
          )
          animations.push(flow)
          resize = new ResizeObserver(() => flow.duration(Math.max(24, track.scrollWidth / 2 / 65)))
          resize.observe(track)
        } else if (kind === 'manifesto') {
          const draw = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 3 })
          element.querySelectorAll<SVGPathElement>('.manifesto__draw').forEach((path, index) => {
            const length = path.getTotalLength()
            draw.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length, opacity: 0.35 },
              { strokeDashoffset: 0, opacity: 1, duration: 1.5, ease: 'power2.inOut' },
              index * 0.3,
            )
          })
          draw.to('.manifesto__draw', { opacity: 0.35, duration: 1, stagger: 0.1 }, '+=3')
          animations.push(draw)
        } else {
          const paths = element.querySelectorAll<SVGPathElement>('.story__draw')
          const draw = gsap.timeline({ paused: true })
          paths.forEach((path, index) => {
            const length = path.getTotalLength()
            draw.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length },
              { strokeDashoffset: 0, duration: 1.7, ease: 'power2.inOut' },
              index * 0.12,
            )
          })
          animations.push(draw)
          const steam = gsap.timeline({ repeat: -1, paused: true })
          steam
            .fromTo(
              '.story__steam',
              { y: 7, opacity: 0 },
              { y: -5, opacity: 0.8, duration: 1.5, stagger: 0.25, ease: 'sine.inOut' },
            )
            .to('.story__steam', {
              y: -15,
              opacity: 0,
              duration: 1.1,
              stagger: 0.2,
              ease: 'sine.inOut',
            })
          animations.push(steam)
        }
      }, element)
      const update = () =>
        animations.forEach((animation) => animation.paused(!visible || document.hidden || hovered))
      const enter = (event: PointerEvent) => {
        if (event.pointerType === 'mouse' && kind === 'ribbon') {
          hovered = true
          update()
        }
      }
      const leave = () => {
        hovered = false
        update()
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting
          update()
        },
        { threshold: 0.05 },
      )
      observer.observe(element)
      element.addEventListener('pointerenter', enter)
      element.addEventListener('pointerleave', leave)
      document.addEventListener('visibilitychange', update)
      return () => {
        observer.disconnect()
        resize?.disconnect()
        context.revert()
        element.removeEventListener('pointerenter', enter)
        element.removeEventListener('pointerleave', leave)
        document.removeEventListener('visibilitychange', update)
      }
    })
    return () => media.revert()
  }, [root, kind])
}
