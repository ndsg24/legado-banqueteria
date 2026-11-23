import type { DietaryOption } from '../../../entities/quote'

type Props = { id: DietaryOption; onSettled?: (loaded: boolean) => void }

export function DietaryModel({ id, onSettled }: Props) {
  return (
    <img
      className="dietary-model"
      src={import.meta.env.BASE_URL + 'images/dietary/still/' + id + '.webp'}
      alt=""
      width={252}
      height={204}
      loading="lazy"
      decoding="async"
      draggable={false}
      onLoad={onSettled && (() => onSettled(true))}
      onError={onSettled && (() => onSettled(false))}
    />
  )
}
