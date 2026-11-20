import type { eventTypes } from '../../../entities/quote'

const illustrations = {
  Matrimonio: (
    <>
      <ellipse cx="37" cy="39" rx="18" ry="13" transform="rotate(-29 37 39)" />
      <ellipse cx="37" cy="39" rx="14" ry="9" transform="rotate(-29 37 39)" />
      <path d="M43 26c5-5 12-6 19-2 9 5 14 14 10 21s-14 8-23 3m-4-4c-5-4-8-9-8-13" />
      <path d="M46 28c4-3 10-3 15 0 7 4 11 11 8 15s-10 5-16 2" />
      <path className="event-icon__foil" d="m21 19 5-6h10l5 6-9 12z M21 19h20m-15-6 6 18 4-18" />
    </>
  ),
  'Encuentro familiar': (
    <>
      <ellipse cx="47" cy="34" rx="29" ry="9" />
      <path d="m19 36-2 13c7 1 11-2 16 1 6 4 11 1 16 0 6-2 11 3 17 1l11-2-2-13" />
      <path d="m26 42-1 5m37-6 2 6 M21 54l-1 3m49-4 1 4" />
      <path
        className="event-icon__foil"
        d="m43 29-2-8h11l-2 8z M46 21v-8c-7 0-10-3-10-7 7 0 10 3 10 7zm1-4c1-5 4-8 10-9-1 6-5 9-10 9z"
      />
      <path d="m25 32 7-1m29 1 7 1m-31 4 8 1" />
    </>
  ),
  'Evento de empresa': (
    <>
      <path d="M18 13h60v5H18z M22 18v25h52V18 M19 44h58 M48 45v8m0-5-12 9m12-9 12 9" />
      <path className="event-icon__foil" d="m30 35 10-8 9 5 15-11m-7 0h7v7" />
      <path d="M30 39h33 M43 9h10" />
    </>
  ),
  'Otra celebración': (
    <>
      <path d="M24 46V33c0-3 10-5 23-5s23 2 23 5v13 M24 33c6 5 39 5 46 0" />
      <path d="M24 38q4 6 8 1 5 7 10 1 5 7 10 0 5 6 10-1 5 5 8-1" />
      <path d="M19 46c5 5 51 5 56 0l-3 5H22z M45 51v3l-7 3h18l-7-3v-3" />
      <path
        className="event-icon__foil"
        d="M37 29v-8h4v8m5 0V16h4v13m5 1v-8h4v8 M39 18q-4-3 0-7 4 4 0 7zm9-5q-4-3 0-8 4 5 0 8zm9 6q-4-3 0-7 4 4 0 7z"
      />
    </>
  ),
} satisfies Record<(typeof eventTypes)[number], React.ReactNode>

const frames = {
  Matrimonio: '8.2 0 72 72',
  'Encuentro familiar': '11 -4.5 72 72',
  'Evento de empresa': '12 -3 72 72',
  'Otra celebración': '11 -5 72 72',
} satisfies Record<(typeof eventTypes)[number], string>

export function EventIcon({ event }: { event: (typeof eventTypes)[number] }) {
  return (
    <svg
      className="event-icon"
      viewBox={frames[event]}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {illustrations[event]}
    </svg>
  )
}
