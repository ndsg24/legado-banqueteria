type EditorialArrowProps = {
  direction?: 'left' | 'right' | 'up-right'
}

const rotations = {
  left: 180,
  right: 0,
  'up-right': -45,
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
      </g>
    </svg>
  )
}
