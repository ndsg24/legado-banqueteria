import { PlaybackIcon } from '../../../shared/ui/PlaybackIcon'
import { tableIdeaHref } from '../../../shared/config/tableIdea'
import { quoteHref } from '../../../shared/routing'
import { ActionLink } from '../../../shared/ui/ActionLink'
import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { Link } from 'react-router'
import { siteConfig } from '../../../shared/config/site'
import {
  tablePhotoDirectory,
  tablePhotoSizes,
  tablePhotoSources,
  tableSettings,
} from '../../../shared/config/heroPhoto'
import { useI18n } from '../../../shared/i18n'
import { EditorialArrow } from '../../../shared/ui/EditorialArrow'
import { DottedTexture } from '../../../shared/ui/DottedTexture'

const base = import.meta.env.BASE_URL + 'images/' + tablePhotoDirectory
const reducedMotion = '(prefers-reduced-motion: reduce)'

type Slide = { current: number; previous: number | null }

function changeSlide(slide: Slide, index: number): Slide {
  return index === slide.current ? slide : { current: index, previous: slide.current }
}

function CoverPhoto({
  setting,
  active = false,
}: {
  setting: (typeof tableSettings)[number]
  active?: boolean
}) {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={tablePhotoSources(base + setting, 'avif')}
        sizes={tablePhotoSizes}
      />
      <img
        className="cover-photo"
        width={1122}
        height={1402}
        data-setting={setting}
        data-active={active}
        alt=""
        draggable={false}
        fetchPriority={setting === tableSettings[0] ? 'high' : 'low'}
        sizes={tablePhotoSizes}
        srcSet={tablePhotoSources(base + setting)}
        src={base + setting + '-1122.webp'}
      />
    </picture>
  )
}

export function Hero() {
  const { t } = useI18n()
  const root = useRef<HTMLElement>(null)
  const front = useRef<HTMLDivElement>(null)
  const movement = useRef<Animation | null>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const [initialSlide] = useState(() => {
    const photo = new URLSearchParams(location.search).get('portada')
    return Math.max(
      0,
      tableSettings.findIndex((setting) => setting === photo),
    )
  })
  const [{ current, previous }, show] = useReducer(changeSlide, {
    current: initialSlide,
    previous: null,
  })
  const [requested, select] = useState(initialSlide)
  const [playing, setPlaying] = useState(() => !matchMedia(reducedMotion).matches)
  const [visible, setVisible] = useState(true)
  const key = tableSettings[current]
  const caption = (
    <>
      {t(`home.hero.${key}.title`)} <em>{t(`home.hero.${key}.titleAccent`)}</em>
    </>
  )
  const next = (current + 1) % tableSettings.length
  const backward = previous === next
  const step = (offset: number) =>
    select((index) => (index + offset + tableSettings.length) % tableSettings.length)

  useLayoutEffect(() => {
    const motion = matchMedia(reducedMotion)
    if (previous === null || motion.matches || !front.current) return

    // The new print already covers the center; only its outer edge travels into place.
    const offset = backward ? '-6%' : '6%'
    const travel = front.current.animate(
      [{ transform: `translateX(${offset})` }, { transform: 'translateX(0)' }],
      { duration: 420, easing: 'cubic-bezier(0.2, 0.75, 0.25, 1)' },
    )
    movement.current = travel
    const stop = () => travel.cancel()
    motion.addEventListener('change', stop)
    return () => {
      motion.removeEventListener('change', stop)
      movement.current = null
      stop()
    }
  }, [current, previous, backward])

  useEffect(() => {
    if (current === requested) return
    const travel = movement.current
    if (!travel || travel.playState === 'finished' || travel.playState === 'idle') {
      show(requested)
      return
    }
    let cancelled = false
    const finish = () => {
      if (!cancelled) show(requested)
    }
    travel.finished.then(finish, finish)
    return () => {
      cancelled = true
    }
  }, [current, requested])

  useEffect(() => {
    const hero = root.current
    if (!hero) return
    const motion = matchMedia(reducedMotion)
    const motionChanged = () => setPlaying(!motion.matches)
    let onScreen = true
    const refresh = () => setVisible(onScreen && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      refresh()
    })
    observer.observe(hero)
    refresh()
    motion.addEventListener('change', motionChanged)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', motionChanged)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  useEffect(() => {
    if (!playing || !visible) return
    const timer = window.setTimeout(() => select(next), 7500)
    return () => window.clearTimeout(timer)
  }, [next, playing, visible])

  return (
    <section
      id="inicio"
      ref={root}
      className="table-cover site-texture"
      data-motion={playing && visible ? 'playing' : 'paused'}
      aria-labelledby="hero-title"
    >
      <DottedTexture />
      <div className="cover-copy">
        <p className="cover-eyebrow">
          <svg viewBox="0 0 47 32" aria-hidden="true" fill="none" stroke="currentColor">
            <path
              d="M2 27 12 11l7 9L22 3l8 14 10-9-2 19Z
                m0 0 17-7 9 7 2-10 8 10M12 11l7 16m3-24 6 24m12-19-7 19M5 30h31"
            />
          </svg>
          {t('home.hero.eyebrow')}
        </p>
        <h1 id="hero-title">
          {t('home.hero.titleLead')}
          <br /> {t('home.hero.titleMiddle')}{' '}
          <em>
            <span>{t('home.hero.titleAccent')}</span>
            <svg viewBox="0 0 84 68" aria-hidden="true" fill="none" stroke="currentColor">
              <path
                d="M10 57q33-10 58-48M24 51Q12 42 15 30q15 4 13 19m8-6q14-2 23 4-12 10-23-4Zm8-8
                q-10-11-4-23 11 7 6 21Zm9-9q13-9 23-4-11 11-23 4Zm9-13q0-9 10-12 0 8-10 12Z"
              />
            </svg>
          </em>
        </h1>
        <p className="cover-description">
          {t('home.hero.descriptionLead')} <br />
          {t('home.hero.descriptionEnd')}
        </p>
        <div className="cover-actions">
          <ActionLink to={quoteHref()}>
            {t('home.hero.contact')} <EditorialArrow direction="up-right" />
          </ActionLink>
          <Link to="/carta.html">
            {t('home.hero.menu')} <EditorialArrow direction="up-right" />
          </Link>
        </div>
      </div>
      <span className="cover-location">{siteConfig.location}</span>
      <div
        className="cover-stage"
        role="group"
        aria-label={t('home.hero.showcase')}
        onFocus={(event) => {
          if (event.target.matches(':focus-visible')) setPlaying(false)
        }}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
          event.preventDefault()
          step(event.key === 'ArrowRight' ? 1 : -1)
        }}
        onTouchStart={(event) => {
          const point = event.touches[0]
          touch.current = { x: point.clientX, y: point.clientY }
        }}
        onTouchCancel={() => {
          touch.current = null
        }}
        onTouchEnd={(event) => {
          if (!touch.current) return
          const dx = event.changedTouches[0].clientX - touch.current.x
          const dy = event.changedTouches[0].clientY - touch.current.y
          touch.current = null
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1)
        }}
      >
        <div className="cover-scene">
          <div className="cover-preview-photo" aria-hidden="true">
            <CoverPhoto setting={tableSettings[next]} />
          </div>
          <div className="cover-scene-photos" role="img" aria-label={t(`home.hero.${key}.alt`)}>
            {tableSettings.map((setting, index) => (
              <div
                key={setting}
                ref={index === current ? front : undefined}
                className="cover-panel"
                data-front={index === current}
                hidden={index !== current && index !== previous}
              >
                <CoverPhoto setting={setting} active={index === current} />
              </div>
            ))}
          </div>
          <div className="cover-legend" data-setting={key}>
            <p className="cover-caption">{caption}</p>
            <p className="cover-detail">{t(`home.hero.${key}.detail`)}</p>
            <div className="cover-tools">
              <div
                className="cover-selector"
                role="group"
                aria-label={t('home.gallery.navigation')}
              >
                {tableSettings.map((setting, index) => (
                  <button
                    key={setting}
                    data-setting={setting}
                    aria-label={t(`home.hero.${setting}.color`)}
                    title={t(`home.hero.${setting}.color`)}
                    aria-pressed={index === current}
                    onClick={() => select(index)}
                  >
                    <img
                      src={base + setting + '-thumb.jpg'}
                      alt=""
                      width="48"
                      height="44"
                      decoding="async"
                    />
                  </button>
                ))}
                <button
                  className="cover-play"
                  aria-label={t(playing ? 'home.hero.pause' : 'home.hero.play')}
                  onClick={() => setPlaying(!playing)}
                >
                  <PlaybackIcon playing={playing} />
                </button>
              </div>
              <ActionLink
                className="cover-table-action"
                to={tableIdeaHref(key)}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') setPlaying(false)
                }}
              >
                {t('quote.idea.quoteTable')} <EditorialArrow direction="up-right" />
              </ActionLink>
            </div>
          </div>
          <span className="cover-edge" aria-hidden="true" />
        </div>
        <button
          className="cover-preview"
          tabIndex={-1}
          aria-label={t('home.hero.next')}
          onClick={() => step(1)}
        />
        <div key={key} className="cover-seam" aria-hidden="true" />
        <button className="cover-next" aria-label={t('home.hero.next')} onClick={() => step(1)}>
          <EditorialArrow direction="up-right" />
        </button>
      </div>
    </section>
  )
}
