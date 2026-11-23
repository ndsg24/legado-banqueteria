import type { StepId } from '../model/steps'

// Each illustration shares the same 64-unit engraving plate.
const engravings: Record<StepId, string[]> = {
  event: [
    'M12 20h40v33H12z M12 29h40 M21 14v11m22-11v11',
    'M23 33l2.5 6.5L32 42l-6.5 2.5L23 51l-2.5-6.5L14 42l6.5-2.5z M36 35h9m-9 6h9m-9 6h6',
    'M16 17h15m3 0h14',
  ],
  menu: [
    'M7 42h50l-4 5H11z M11 39a21 21 0 0 1 42 0 M30 17a3 3 0 1 1 4 0',
    'M16 36c1-6 5-11 10-13 M15 51h34 M8 54h48',
    'M46 12l1.3 3.7L51 17l-3.7 1.3L46 22l-1.3-3.7L41 17l3.7-1.3z',
  ],
  dietary: [
    'M16 54c7-9 13-17 22-31 M29 38c-5-14-1-23 13-29 3 14-1 24-13 29z',
    'M24 43C13 43 9 36 8 26c11 1 17 6 16 17z M26 43c5-11 15-15 29-13-6 13-15 17-29 13z',
    'M16 34l7 8 M35 38l11-4 M35 25l3-9 M14 55l6 1',
  ],
  table: [
    'M6 30c0-5 12-9 26-9s26 4 26 9-12 9-26 9S6 35 6 30z',
    'M8 33l-2 15c5 4 9-2 13 1s7 5 13 2 10 1 14-1 7 1 12-2l-2-15',
    'M28 23l-1-8h10l-1 8 M32 15V9m0 5c-6 0-7-4-7-7 5 0 7 3 7 7zm0-2c0-5 3-7 7-8 0 5-2 8-7 8z',
    'M13 29q5-3 11 0-5 3-11 0z M39 29q5-3 11 0-5 3-11 0z M19 39l-2 7m25-7 2 7',
  ],
  contact: [
    'M7 24l25-14 25 14v29H7z M8 25l24 17 24-17 M8 51l17-16m31 16L39 35',
    'M16 28V14h32v14 M22 21h19m-19 5h13',
    'M29 39a4 4 0 1 1 6 5 4 4 0 0 1-6-5z',
  ],
  review: [
    'M15 9h29l5 5v41H15z M43 10v6h6 M11 16v42h31',
    'M22 22h17m-17 6h20m-20 6h13 M23 44l4 4 8-10',
    'M42 34a7 7 0 1 1 0 14 7 7 0 0 1 0-14z M38 47l-1 7 5-3 5 3-1-7',
  ],
}

export function QuoteStepIcon({ step }: { step: StepId }) {
  return (
    <svg
      className="quote-step-icon"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {engravings[step].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
