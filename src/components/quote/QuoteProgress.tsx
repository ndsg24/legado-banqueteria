import type { Ref } from 'react'
import { steps } from '../../quote/steps'

type Props = {
  step: number
  sent: boolean
  busy: boolean
  onGoTo: (step: number) => void
  ref: Ref<HTMLElement>
}

export function QuoteProgress({ step, sent, busy, onGoTo, ref }: Props) {
  return (
    <nav className="quote-progress" aria-label="Pasos de la cotización" ref={ref}>
      <ol>
        {steps.map((part, index) => {
          const completed = index < step || sent
          return (
            <li key={part.label} data-completed={completed}>
              <button
                type="button"
                onClick={() => onGoTo(index)}
                disabled={index >= step || sent || busy}
                aria-current={index === step && !sent ? 'step' : undefined}
                aria-label={`Paso ${index + 1}, ${part.label}${completed ? ', completado' : ''}`}
              >
                <span className="quote-progress__marker" aria-hidden="true">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={part.icon} />
                  </svg>
                  {String(index + 1).padStart(2, '0')}
                  {completed && (
                    <svg
                      className="quote-progress__check"
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m4 8 2.6 2.6L12 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                {part.label}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
