import type { eventTypes } from '../../quote/request'

const paths: Record<(typeof eventTypes)[number], string> = {
  Matrimonio:
    'M13.3 13.5a5.3 5.3 0 1 1-10.6 0 5.3 5.3 0 0 1 10.6 0Zm8-2a5.3 5.3 0 1 1-10.6 0 5.3 5.3 0 0 1 10.6 0ZM7 5 8 3l2 2',
  'Encuentro familiar': `M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm9 1a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM2 20v-2
      a6 6 0 0 1 12 0v2m2-6a4.5 4.5 0 0 1 6 4v2`,
  'Evento de empresa': 'M3 8h18v12H3zM8 8V5h8v3M3 12q9 5 18 0m-9 0v3',
  'Otra celebración': 'M3 21 7 8l9 9-13 4Zm4-13q5-2 9 9M13 7c4 0 0-4 5-5m0 9 3-2m-3 5 3 1M9 3l1 2',
}

export function EventIcon({ event }: { event: (typeof eventTypes)[number] }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[event]} />
    </svg>
  )
}
