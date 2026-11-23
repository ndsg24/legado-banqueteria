import { EditorialArrow } from '../atoms/EditorialArrow'

type Props = {
  className: string
  label: string
  previous: string
  next: string
  onTurn: (direction: -1 | 1) => void
}

export function AlbumArrows({ className, label, previous, next, onTurn }: Props) {
  return (
    <div className={'album-arrows ' + className} role="group" aria-label={label}>
      <button type="button" aria-label={previous} onClick={() => onTurn(-1)}>
        <EditorialArrow direction="left" />
      </button>
      <button type="button" aria-label={next} onClick={() => onTurn(1)}>
        <EditorialArrow direction="right" />
      </button>
    </div>
  )
}
