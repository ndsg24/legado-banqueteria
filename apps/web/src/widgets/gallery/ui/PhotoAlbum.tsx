import { useI18n } from '../../../shared/i18n'
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { galleryItems } from '../model/photos'
import { AlbumArrows } from '../../../shared/ui/AlbumArrows'
import { PhotoSketch } from './PhotoSketch'

export function PhotoAlbum({ startIndex, onClose }: { startIndex: number; onClose: () => void }) {
  const { t } = useI18n()

  const dialog = useRef<HTMLDialogElement>(null)
  const [stack, setStack] = useState([startIndex])
  const wheel = useRef({ last: 0, distance: 0, turned: false })
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const opened = stack[0]
  const item = galleryItems[opened]

  useLayoutEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal()
  }, [])

  const turnPhoto = (direction: number) => {
    setStack((previous) => {
      const next = (previous[0] + direction + galleryItems.length) % galleryItems.length
      return [next, ...previous.filter((index) => index !== next)]
    })
  }

  return (
    <dialog
      className="memory-viewer"
      ref={dialog}
      aria-label={t('home.gallery.album')}
      onClose={onClose}
      onWheel={(event) => {
        if (event.ctrlKey) return
        const print = event.currentTarget.querySelector('figure')
        if (print && print.scrollHeight > print.clientHeight + 1) return
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
        if (!delta) return
        const gesture = wheel.current
        const now = performance.now()
        if (now - gesture.last > 180 || Math.sign(delta) !== Math.sign(gesture.distance)) {
          gesture.distance = 0
          gesture.turned = false
        }
        gesture.last = now
        gesture.distance +=
          delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1)
        if (!gesture.turned && Math.abs(gesture.distance) >= 36) {
          gesture.turned = true
          turnPhoto(Math.sign(gesture.distance))
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close()
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') turnPhoto(1)
        if (event.key === 'ArrowLeft') turnPhoto(-1)
      }}
    >
      <div
        className="memory-viewer__stack"
        style={{ '--photo-ratio': item.width / item.height } as CSSProperties}
      >
        {stack.slice(1).map((index, depth) => {
          const photo = galleryItems[index]
          return (
            <div
              key={index}
              aria-hidden="true"
              className="instant-print-back"
              data-depth={depth + 1}
              style={{ '--photo-ratio': photo.width / photo.height } as CSSProperties}
            >
              <img
                alt=""
                src={`${import.meta.env.BASE_URL}images/gallery/${photo.src}`}
                width={photo.width}
                height={photo.height}
              />
              <div className="instant-print-back__caption">
                <small>
                  {String(index + 1).padStart(2, '0')} /{' '}
                  {String(galleryItems.length).padStart(2, '0')} · {t(photo.detail)}
                </small>
                <h3>{t(photo.title)}.</h3>
              </div>
            </div>
          )
        })}
        <figure className="instant-print">
          <div
            className="instant-print__image"
            onPointerDown={(event) => {
              if (event.pointerType === 'mouse') return
              swipe.current = event.isPrimary ? { x: event.clientX, y: event.clientY } : null
            }}
            onPointerCancel={() => {
              swipe.current = null
            }}
            onPointerUp={(event) => {
              const start = swipe.current
              swipe.current = null
              if (!start || !event.isPrimary) return
              const dx = start.x - event.clientX
              const dy = start.y - event.clientY
              const distance = Math.abs(dx) > Math.abs(dy) ? dx : dy
              if (Math.abs(distance) >= 45) turnPhoto(Math.sign(distance))
            }}
          >
            <img
              key={item.src}
              src={`${import.meta.env.BASE_URL}images/gallery/${'fullSrc' in item ? item.fullSrc : item.src}`}
              alt={t(item.alt)}
              width={item.width}
              height={item.height}
            />
            <PhotoSketch motif={item.sketch} />
          </div>
          <figcaption>
            <div aria-live="polite" aria-atomic="true">
              <small>
                {String(opened + 1).padStart(2, '0')} /{' '}
                {String(galleryItems.length).padStart(2, '0')} · {t(item.detail)}
              </small>
              <h3>{t(item.title)}.</h3>
            </div>
          </figcaption>
        </figure>
        <button
          className="memory-viewer__close"
          type="button"
          autoFocus
          aria-label={t('home.gallery.close')}
          onClick={() => dialog.current?.close()}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <AlbumArrows
        className="memory-viewer__navigation"
        label={t('home.gallery.navigation')}
        previous={t('home.gallery.previous')}
        next={t('home.gallery.next')}
        onTurn={turnPhoto}
      />
    </dialog>
  )
}
