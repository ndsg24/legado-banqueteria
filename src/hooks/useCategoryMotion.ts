import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import { gsap } from 'gsap'

/** Keeps pointer choreography local to the picker; touch uses the same selection state. */
export function useCategoryMotion(listRef: RefObject<HTMLDivElement | null>, activeId: string) {
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const media = gsap.matchMedia()
    const cleanups: (() => void)[] = []
    const context = gsap.context(() => {
      const buttons = list.querySelectorAll<HTMLButtonElement>('.tasting-menu__course')
      buttons.forEach((button) => {
        const outline = button.querySelector('.tasting-menu__outline ellipse')
        const selected = button.getAttribute('aria-pressed') === 'true'
        gsap.to(outline, {
          autoRound: false,
          strokeDashoffset: selected ? 0 : 1,
          opacity: selected ? 1 : 0,
          duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.75,
          ease: 'power3.inOut',
        })
      })
      media.add(
        '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          buttons.forEach((button) => {
            const art = button.querySelector('.tasting-menu__illustration')
            const outline = button.querySelector('.tasting-menu__outline')
            const stroke = button.querySelector('.tasting-menu__outline ellipse')
            const selected = button.getAttribute('aria-pressed') === 'true'
            const x = gsap.quickTo(art, 'x', { duration: 0.55, ease: 'power3.out' })
            const y = gsap.quickTo(art, 'y', { duration: 0.55, ease: 'power3.out' })
            const enter = () => {
              gsap.to(stroke, {
                autoRound: false,
                strokeDashoffset: 0,
                opacity: 1,
                duration: 0.65,
                ease: 'power3.out',
                overwrite: true,
              })
              gsap.to(art, { scale: 1.14, duration: 0.65, ease: 'power3.out' })
              gsap.to(outline, { rotation: 7, duration: 0.8, ease: 'power3.out' })
            }
            const move = (event: PointerEvent) => {
              const rect = button.getBoundingClientRect()
              x(((event.clientX - rect.left) / rect.width - 0.5) * 16)
              y(((event.clientY - rect.top) / rect.height - 0.5) * 12)
            }
            const leave = () => {
              x(0)
              y(0)
              gsap.to(art, { scale: 1, duration: 0.6, ease: 'power3.out' })
              gsap.to(outline, { rotation: 0, duration: 0.8, ease: 'power3.out' })
              gsap.to(stroke, {
                autoRound: false,
                strokeDashoffset: selected ? 0 : 1,
                opacity: selected ? 1 : 0,
                duration: 0.5,
                overwrite: true,
              })
            }
            button.addEventListener('pointerenter', enter)
            button.addEventListener('pointermove', move)
            button.addEventListener('pointerleave', leave)
            button.addEventListener('focus', enter)
            button.addEventListener('blur', leave)
            cleanups.push(() => {
              button.removeEventListener('pointerenter', enter)
              button.removeEventListener('pointermove', move)
              button.removeEventListener('pointerleave', leave)
              button.removeEventListener('focus', enter)
              button.removeEventListener('blur', leave)
              x.tween.kill()
              y.tween.kill()
              gsap.killTweensOf([art, outline, stroke])
            })
          })
          return () => {
            cleanups.splice(0).forEach((cleanup) => cleanup())
          }
        },
      )
    }, list)
    return () => {
      media.revert()
      cleanups.splice(0).forEach((cleanup) => cleanup())
      context.revert()
    }
  }, [listRef, activeId])
}
