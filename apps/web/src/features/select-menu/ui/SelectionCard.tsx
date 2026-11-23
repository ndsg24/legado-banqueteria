import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from 'react'
import { useI18n } from '../../../shared/i18n'

type Props = ComponentPropsWithoutRef<'article'> & {
  selected: boolean
  photo: ReactNode
  watermark: ReactNode
  caption: ReactNode
  badge?: ReactNode
  companion?: ReactNode
  selectedId?: string
  details?: ButtonHTMLAttributes<HTMLButtonElement>
}

export function SelectionCard({
  selected,
  watermark,
  photo,
  badge,
  companion,
  selectedId,
  caption,
  details,
  children,
  ...article
}: Props) {
  const { t } = useI18n()
  const face = (
    <>
      <span className="quote-dish__frame">
        {badge}
        {photo}
        {companion}
        {selected && (
          <span
            id={selectedId}
            className="quote-dish__check"
            role="img"
            aria-label={t('quote.selection.selected')}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="m3 8 3 3 7-7" />
            </svg>
          </span>
        )}
      </span>
      <span className="quote-dish__caption">
        <span>{caption}</span>
      </span>
    </>
  )
  return (
    <article {...article} className="quote-dish" data-selected={selected}>
      {watermark}
      {details ? (
        <button type="button" className="quote-dish__details" {...details}>
          {face}
        </button>
      ) : (
        <div className="quote-dish__details">{face}</div>
      )}
      {children}
    </article>
  )
}
