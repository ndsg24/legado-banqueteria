const drawings = {
  name: (
    <>
      <circle cx="32" cy="20" r="8" />
      <path d="M13 52v-4a19 15 0 0 1 38 0v4Z" />
      <path className="event-icon__foil" d="m25 35 7 7 7-7" />
    </>
  ),
  email: (
    <>
      <rect x="7" y="15" width="50" height="34" rx="3" />
      <path className="event-icon__foil" d="m9 17 21 17q2 2 4 0l21-17" />
      <path d="m10 46 14-13m30 13L40 33" />
    </>
  ),
  phone: (
    <>
      <path d="m15 9 6-2 7 12-5 6c3 7 8 12 15 15l6-5 12 7-2 6c-2 6-6 8-12 6C26 49 15 38 9 22c-2-6 0-11 6-13Z" />
      <path className="event-icon__foil" d="M37 16a13 13 0 0 1 12 12M38 9a20 20 0 0 1 18 18" />
    </>
  ),
  guests: (
    <>
      <circle cx="32" cy="20" r="8" />
      <path d="M17 51v-5a15 15 0 0 1 30 0v5Z" />
      <path className="event-icon__foil" d="M16 16a6 6 0 1 0 0 12m-3 5a11 11 0 0 0-9 11v3h8" />
      <path className="event-icon__foil" d="M48 16a6 6 0 1 1 0 12m3 5a11 11 0 0 1 9 11v3h-8" />
    </>
  ),
  location: (
    <>
      <path d="M48 24c0 12-16 28-16 28S16 36 16 24a16 16 0 1 1 32 0Z" />
      <circle className="event-icon__foil" cx="32" cy="24" r="6" />
      <path
        className="event-icon__foil"
        d="M21 48c-5 1-8 2-8 4 0 3 9 5 19 5s19-2 19-5c0-2-3-3-8-4"
      />
    </>
  ),
  date: (
    <>
      <rect x="10" y="14" width="44" height="39" rx="4" />
      <path d="M10 25h44" />
      <path className="event-icon__foil" d="M21 9v10m22-10v10M25 38l5 5 10-12" />
    </>
  ),
}

export function QuoteDetailIcon({ kind }: { kind: keyof typeof drawings }) {
  return (
    <svg
      className="quote-event-detail-icon"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {drawings[kind]}
    </svg>
  )
}
