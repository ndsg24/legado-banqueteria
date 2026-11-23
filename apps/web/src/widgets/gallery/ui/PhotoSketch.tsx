const sketchPaths = {
  stars: `M34 13q0 19 15 21-15 1-18 19 0-17-14-20 14-2 17-20ZM62 7
      q1 10 9 11-9 2-10 11-1-9-8-11 8-1 9-11ZM66 39l3 4m6-12 5 1M14 55l-4 4`,
  citrus: `M12 43q15-15 43-28c11 23 3 40-13 46-12 5-24 0-30-18Zm6 0c9 13 19 16 28 10 12-7 14-17 8-32Z
      M39 33l-1 17m6-20 8 9m-19-1-8 5M58 14q7-12 21-9-6 12-21 9Z`,
  toast: `m14 13 21 5-6 17q-3 8-11 5t-6-12Zm6 28-5 13m-8-2 16 4m-8-30 16 4m17-12 21-6 3 17q2 9-6 12
      t-12-6Zm15 24 5 12m-9 3 16-5m-22-20 16-5M41 5l1 7m-9-8 3 5m13-6-3 6`,
  candle: `M28 53V30q6 2 14 0v23m-15 1q8 3 16-1m-8-23v-6m0 0c-8-3-5-10 2-16 0 6 6 12-2 16Zm13 28V38
      q5 2 10 0v13m-5-13v-4c-6-2-3-8 1-12 1 5 4 8-1 12ZM17 54q13 13 47-1m-43 7q17 7 38 0`,
  leaves: `M10 57q33-10 58-48M24 51Q12 42 15 30q15 4 13 19m8-6q14-2 23 4-12 10-23-4Zm8-8
      q-10-11-4-23 11 7 6 21Zm9-9q13-9 23-4-11 11-23 4Zm9-13q0-9 10-12 0 8-10 12Z`,
} as const

export function PhotoSketch({ motif }: { motif: keyof typeof sketchPaths }) {
  return (
    <svg
      className={`photo-sketch photo-sketch--${motif}`}
      viewBox="0 0 84 68"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={sketchPaths[motif]} />
    </svg>
  )
}
