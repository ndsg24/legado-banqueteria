import { useI18n } from '../../../shared/i18n'
import { useEffect, useRef, useState, type UIEvent } from 'react'
import { galleryItems } from '../model/photos'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'
import { RingLines } from '../../../shared/ui/BackgroundMotifs'

import { PhotoSketch } from './PhotoSketch'
import { PhotoAlbum } from './PhotoAlbum'

export function Gallery() {
  const { t } = useI18n()

  const [photosNear, setPhotosNear] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const [active, setActive] = useState(0)
  const [opened, setOpened] = useState<number | null>(null)

  useEffect(() => {
    const grid = stage.current
    if (!grid) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setPhotosNear(true)
        observer.disconnect()
      },
      { rootMargin: '400px 0px' },
    )
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  const scrollTo = (index: number) => {
    const card = stage.current?.querySelector<HTMLElement>(`[data-memory="${index}"]`)
    if (card && stage.current)
      stage.current.scrollTo({
        left: card.offsetLeft - stage.current.offsetLeft,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      })
  }
  const track = (event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    const cards = Array.from(element.querySelectorAll<HTMLElement>('[data-memory]'))
    const closest = cards.reduce(
      (best, card, index) =>
        Math.abs(card.offsetLeft - element.offsetLeft - element.scrollLeft) <
        Math.abs(cards[best].offsetLeft - element.offsetLeft - element.scrollLeft)
          ? index
          : best,
      0,
    )
    setActive(closest)
  }
  const open = (index: number, button: HTMLButtonElement) => {
    opener.current = button
    setOpened(index)
  }

  return (
    <section className="gallery gallery--editorial" id="galeria" aria-labelledby="gallery-title">
      <div className="gallery__motifs" aria-hidden="true">
        <svg className="gallery__garland" viewBox="0 0 320 112" focusable="false">
          <path d="M-8 5Q132 128 328 14" />
          <g fill="currentColor" stroke="none">
            <circle cx="37" cy="37" r="3" />
            <circle cx="90" cy="58" r="3" />
            <circle cx="150" cy="68" r="3" />
            <circle cx="217" cy="61" r="3" />
            <circle cx="279" cy="40" r="3" />
          </g>
          <path d="m90 67 0 5m-6-7-3 4m15-4 3 4m118 1v5m-7-7-3 4m16-4 3 4" />
        </svg>
        <svg className="gallery__sprig" viewBox="0 0 150 210" focusable="false">
          <path
            d={`M9 202Q75 150 116 20M30 182Q25 153 40 125Q55 159 30 182ZM52 153Q81 121 102 127
            Q85 152 52 153ZM72 121Q52 101 62 72Q82 91 72 121ZM88 89Q103 60 136 60Q120 84 88 89ZM103 55
            Q89 32 106 9Q117 32 103 55Z`}
          />
        </svg>
        <svg className="gallery__plate" viewBox="0 0 220 220" focusable="false">
          <RingLines />
        </svg>
      </div>
      <header className="gallery__header">
        <div>
          <span>{t('home.gallery.eyebrow')}</span>
          <strong>03 — 04</strong>
        </div>
        <h2 id="gallery-title">
          {t('home.gallery.title')}
          <br />
          <em>{t('home.gallery.accent')}</em>
        </h2>
        <p>
          <span>{t('home.gallery.description')}</span>
          <small>
            {t('home.gallery.invitation')} <EditorialArrow direction="up-right" />
          </small>
        </p>
      </header>
      <div
        className="memories"
        ref={stage}
        onScroll={track}
        aria-label={t('home.gallery.gallery')}
        tabIndex={0}
      >
        {galleryItems.map((photo, index) => (
          <figure className={`memory memory--${index + 1}`} data-memory={index} key={photo.src}>
            <button
              className="memory__open"
              type="button"
              aria-label={t('home.gallery.enlargeNamed', { name: t(photo.title) })}
              onClick={(event) => open(index, event.currentTarget)}
            >
              {photosNear ? (
                <img
                  src={`${import.meta.env.BASE_URL}images/gallery/${photo.src}`}
                  srcSet={
                    'srcSet' in photo
                      ? photo.srcSet
                          .split(', ')
                          .map((source) => `${import.meta.env.BASE_URL}images/gallery/${source}`)
                          .join(', ')
                      : undefined
                  }
                  alt={t(photo.alt)}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  sizes={
                    index === 0
                      ? '(max-width: 760px) 82vw, (min-width: 1980px) 1250px, 65vw'
                      : '(max-width: 760px) 82vw, (min-width: 1980px) 1130px, 60vw'
                  }
                />
              ) : (
                <span className="memory__placeholder" aria-hidden="true" />
              )}
              <PhotoSketch motif={photo.sketch} />
              <span className="memory__discover" aria-hidden="true">
                {t('home.gallery.enlarge')} <EditorialArrow direction="up-right" />
              </span>
            </button>
            <figcaption>
              <span>0{index + 1}</span>
              <div>
                <small>{t(photo.detail)}</small>
                <h3>{t(photo.title)}.</h3>
              </div>
              <span aria-hidden="true">
                <EditorialArrow direction="up-right" />
              </span>
            </figcaption>
          </figure>
        ))}
        <aside className="memories__aside">
          <span aria-hidden="true">✦</span>
          <p>
            {t('home.gallery.momentsTitle')}
            <br />
            <em>{t('home.gallery.momentsAccent')}</em>
          </p>
          <small>{t('home.gallery.linger')}</small>
        </aside>
      </div>
      <div className="memories__nav">
        <span>
          <em>{t('home.gallery.swipe')}</em> {t('home.gallery.stay')}
        </span>
        <output aria-live="polite">
          {String(active + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
        </output>
        <button
          type="button"
          aria-label={t('home.gallery.previousMemory')}
          disabled={active === 0}
          onClick={() => scrollTo(active - 1)}
        >
          <EditorialArrow direction="left" />
        </button>
        <button
          type="button"
          aria-label={t('home.gallery.nextMemory')}
          disabled={active === galleryItems.length - 1}
          onClick={() => scrollTo(active + 1)}
        >
          <EditorialArrow direction="right" />
        </button>
      </div>
      <p className="gallery__note">{t('home.gallery.footnote')}</p>
      {opened !== null && (
        <PhotoAlbum
          startIndex={opened}
          onClose={() => {
            setOpened(null)
            opener.current?.focus({ preventScroll: true })
          }}
        />
      )}
    </section>
  )
}
