import { useId, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useI18n } from '../../../shared/i18n'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'
import {
  firstTablePhoto,
  tablePhotoSizes,
  tablePhotoSources,
} from '../../../shared/config/heroPhoto'
import { HeroIdleReactions, HeroReactions } from './HeroReactions'

const imageBase = import.meta.env.BASE_URL + 'images/'
const settings = [
  { image: firstTablePhoto, section: 'gathering' },
  { image: 'table-celebracion-v1', section: 'celebration' },
  { image: 'table-sobremesa-v1', section: 'dessert' },
] as const

type Section = (typeof settings)[number]['section']
type PhotoStatus = Partial<Record<Section, 'ready' | 'error'>>

export function HeroFoodShowcase() {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const descriptionId = useId()
  const [photos, setPhotos] = useState<PhotoStatus>({})
  const [open, setOpen] = useState<Section | null>(null)
  const [pointed, setPointed] = useState<Section | null>(null)
  const [focused, setFocused] = useState<Section | null>(null)
  const complete = settings.every(({ section }) => photos[section])
  const available = settings.filter(({ section }) => photos[section] !== 'error')
  const preview = complete && !open && available.length > 1 ? (pointed ?? focused) : null
  const kind = settings.findIndex(({ section }) => section === open)
  const idle = complete && available.length === settings.length && !preview && !open

  return (
    <div
      className="hero-food hero-triptych"
      role="group"
      aria-label={t('home.hero.showcase')}
      data-ready={complete}
      data-count={available.length}
      data-idle={idle || undefined}
      data-preview={
        preview ? available.findIndex(({ section }) => section === preview) + 1 : undefined
      }
      onPointerLeave={() => setPointed(null)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(null)
      }}
    >
      {available.map(({ section, image }, index) => {
        const expanded = open === section
        const base = imageBase + image
        const source = {
          src: base + '.webp',
          srcSet: tablePhotoSources(base),
          sizes: tablePhotoSizes,
          width: 1254,
          height: 1254,
        }
        const single = available.length === 1 && complete
        return (
          <button
            key={section}
            type="button"
            className="hero-triptych__cut"
            data-expanded={expanded || single}
            data-away={open !== null && !expanded}
            data-preview={preview === section}
            disabled={!complete || single}
            inert={open !== null && !expanded}
            aria-expanded={expanded}
            aria-label={
              expanded
                ? t('home.hero.fold')
                : t('home.hero.openScene', { name: t(`home.hero.${section}.chapter`) })
            }
            aria-describedby={descriptionId + section}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'touch') setPointed(section)
            }}
            onFocus={(event) => {
              if (event.currentTarget.matches(':focus-visible')) {
                setPointed(null)
                setFocused(section)
              }
            }}
            onBlur={() => setFocused(null)}
            onClick={() => setOpen(expanded ? null : section)}
          >
            {(section === 'gathering' || photos.gathering) && (
              <span className={`hero-triptych__photo hero-triptych__photo--${section}`}>
                <img
                  {...source}
                  alt={t(`home.hero.${section}.alt`)}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                  onLoad={() => setPhotos((current) => ({ ...current, [section]: 'ready' }))}
                  onError={() => {
                    setPhotos((current) => ({ ...current, [section]: 'error' }))
                    setOpen((previous) => (previous === section ? null : previous))
                  }}
                />
                {section === 'celebration' && <img {...source} alt="" aria-hidden="true" />}
              </span>
            )}
            <span className="hero-triptych__label" data-full={expanded || single}>
              <span className="hero-triptych__heading">{t(`home.hero.${section}.chapter`)}</span>
              <span className="hero-triptych__dish" id={descriptionId + section}>
                {t(`home.hero.${section}.title`)}
              </span>
              {!expanded && !single && <EditorialArrow direction="up-right" />}
              {expanded && (
                <small>
                  <EditorialArrow direction="left" />
                  {t('home.hero.fold')}
                </small>
              )}
            </span>
          </button>
        )
      })}
      {idle && !reduced && <HeroIdleReactions />}
      {kind >= 0 && <HeroReactions kind={kind} enabled={!reduced} />}
      {available.length === 0 && (
        <button className="hero-triptych__retry" onClick={() => setPhotos({})}>
          {t('home.hero.retry')}
        </button>
      )}
    </div>
  )
}
