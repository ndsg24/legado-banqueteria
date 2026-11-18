type EditorialArrowProps = {
  direction?: 'left' | 'right' | 'up-right' | 'up' | 'down' | 'both'
}

const rotations = {
  left: 180,
  right: 0,
  'up-right': -45,
  up: -90,
  down: 90,
  both: 0,
} as const

export function EditorialArrow({ direction = 'right' }: EditorialArrowProps) {
  return (
    <svg
      aria-hidden="true"
      className="editorial-arrow"
      fill="none"
      viewBox="0 0 24 24"
    >
      <g transform={`rotate(${rotations[direction]} 12 12)`}>
        <path d="M4 12H19" />
        <path d="M14 7L19 12L14 17" />
        {direction === 'both' && <path d="M9 7L4 12L9 17" />}
      </g>
    </svg>
  )
}
