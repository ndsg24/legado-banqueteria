import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

const positions = [
  [9, 38],
  [86, 30],
  [23, 20],
  [78, 63],
  [9, 69],
  [91, 51],
] as const

function ReactionIcon({ kind, accent }: { kind: number; accent: boolean }) {
  return (
    <svg
      viewBox="0 0 48 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {accent ? (
        <>
          <path
            d="M24 8c0 10-4 14-13 15 9 1 13 5 13 15 0-10 4-14 13-15-9-1-13-5-13-15Z"
            fill="currentColor"
            fillOpacity=".25"
          />
          <circle cx="39" cy="7" r="1.5" fill="currentColor" />
        </>
      ) : kind === 0 ? (
        <>
          <path d="M10 38C10 17 23 9 38 9c0 18-7 29-23 29M10 38 33 15M18 29V18m7 2h9" />
          <path className="hero-reaction__trail" d="m9 47 5-5m-9-1 5-5" />
        </>
      ) : kind === 1 ? (
        <>
          <path
            d="M24 39S7 29 7 18a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 11-17 21-17 21Z"
            fill="currentColor"
            fillOpacity=".28"
          />
          <path className="hero-reaction__trail" d="M16 47v5m8-7v7m8-5v5" />
        </>
      ) : (
        <>
          <g className="hero-reaction__glass hero-reaction__glass--left">
            <path d="m8 13 11 4-4 12c-2 5-9 2-7-3l0-13Zm2 19-3 10m-4-1 9 3" />
            <path d="m9 23 8 3" />
          </g>
          <g className="hero-reaction__glass hero-reaction__glass--right">
            <path d="m40 13-11 4 4 12c2 5 9 2 7-3l0-13Zm-2 19 3 10m-5 2 9-3" />
            <path d="m31 26 8-3" />
          </g>
          <path className="hero-reaction__clink" d="M24 5v6m-7-6 3 5m11-5-3 5" />
          <circle cx="24" cy="38" r="1.5" />
        </>
      )}
    </svg>
  )
}

/** Hand-drawn culinary accents follow a distinct rhythm for each table. */
export function HeroReactions({ kind, enabled }: { kind: number; enabled: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (!root.current || !enabled) return
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.hero-reaction').forEach((particle, index) => {
        const direction = index % 2 === 0 ? -1 : 1
        const sequence = gsap
          .timeline({ repeat: -1, repeatDelay: 1.1, delay: index * 0.48 })
          .fromTo(
            particle,
            { autoAlpha: 0, y: 25, x: 0, scale: 0.35, rotation: direction * -18 },
            {
              autoAlpha: 0.95,
              y: 0,
              scale: 1,
              rotation: direction * 6,
              duration: 0.85,
              ease: 'back.out(1.5)',
            },
          )
        if (kind === 1)
          sequence.to(particle, {
            scale: 1.18,
            duration: 0.28,
            repeat: 1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        sequence
          .to(particle, {
            x: direction * (kind === 0 ? 38 : 18),
            y: -70,
            rotation: direction * (kind === 0 ? 28 : 12),
            duration: 2.2,
            ease: 'sine.inOut',
          })
          .to(
            particle,
            { autoAlpha: 0, y: -105, scale: 0.65, duration: 0.65, ease: 'sine.in' },
            '-=.6',
          )
        if (kind === 2 && index % 3 !== 2) {
          sequence.fromTo(
            particle.querySelector('.hero-reaction__glass--left'),
            { rotation: -12, transformOrigin: '50% 80%' },
            { rotation: 0, duration: 0.5, ease: 'back.out(2)' },
            0.35,
          )
          sequence.fromTo(
            particle.querySelector('.hero-reaction__glass--right'),
            { rotation: 12, transformOrigin: '50% 80%' },
            { rotation: 0, duration: 0.5, ease: 'back.out(2)' },
            0.35,
          )
        }
      })
      gsap.utils.toArray<SVGPathElement>('.hero-table__flourish path').forEach((path, index) => {
        const length = path.getTotalLength()
        gsap
          .timeline({ repeat: -1, repeatDelay: 2.2, delay: index * 1.3 })
          .fromTo(
            path,
            { opacity: 0, strokeDasharray: length, strokeDashoffset: length },
            { opacity: 0.65, strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' },
          )
          .to(
            path,
            { opacity: 0, strokeDashoffset: -length, duration: 1.4, ease: 'power2.inOut' },
            '+=.25',
          )
      })
    }, root.current)
    return () => context.revert()
  }, [kind, enabled])
  return (
    <div
      className={`hero-table__reactions hero-table__reactions--${kind}`}
      ref={root}
      aria-hidden="true"
    >
      <svg className="hero-table__flourish" viewBox="0 0 600 600">
        <path d="M68 345C20 274 42 190 94 155M504 370c40-45 51-111 25-154" />
        <path d="M122 104c40-34 83-49 127-45M408 94c29 7 49 22 68 42" />
      </svg>
      {positions.map(([left, top], index) => (
        <span className="hero-reaction" key={index} style={{ left: `${left}%`, top: `${top}%` }}>
          <ReactionIcon kind={kind} accent={index % 3 === 2} />
        </span>
      ))}
    </div>
  )
}
