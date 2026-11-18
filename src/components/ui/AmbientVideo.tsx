import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

type AmbientVideoProps = {
  className: string
  name: string
  caption: string
  poster: string
  mp4: string
  webm: string
  mobileMp4: string
  mobileWebm: string
}

/** Silent background footage with explicit pause and a reduced-motion photograph. */
export function AmbientVideo({
  className,
  name,
  caption,
  poster,
  mp4,
  webm,
  mobileMp4,
  mobileWebm,
}: AmbientVideoProps) {
  const root = useRef<HTMLElement>(null)
  const player = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState(false)
  const reduced = useReducedMotion()
  const useVideo = !reduced && !failed
  const playing = useVideo && visible && pageVisible && ready && !paused
  const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

  useEffect(() => {
    if (!root.current) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.2,
    })
    observer.observe(root.current)
    const update = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])
  useEffect(() => {
    const video = player.current
    if (!video) return
    let cancelled = false
    if (playing)
      video.play().catch((error: unknown) => {
        if (!cancelled && !(error instanceof DOMException && error.name === 'AbortError'))
          setPaused(true)
      })
    else video.pause()
    return () => {
      cancelled = true
      video.pause()
    }
  }, [playing])

  return (
    <figure className={className} ref={root}>
      {useVideo ? (
        <video
          ref={player}
          poster={asset(poster)}
          muted
          loop
          playsInline
          preload={visible ? 'auto' : 'none'}
          onCanPlay={() => setReady(true)}
          onError={(event) => {
            if (event.currentTarget.error) setFailed(true)
          }}
          aria-label={name}
        >
          <source src={asset(mobileWebm)} type="video/webm" media="(max-width: 760px)" />
          <source src={asset(webm)} type="video/webm" media="(min-width: 761px)" />
          <source src={asset(mobileMp4)} type="video/mp4" media="(max-width: 760px)" />
          <source src={asset(mp4)} type="video/mp4" onError={() => setFailed(true)} />
        </video>
      ) : (
        <img
          src={asset(poster)}
          alt={name}
          width="1104"
          height="832"
          loading="lazy"
          decoding="async"
        />
      )}
      <figcaption>{caption}</figcaption>
      {useVideo && ready && (
        <button
          className="ambient-video__toggle"
          type="button"
          aria-label={paused ? 'Reproducir video de nuestra mesa' : 'Pausar video de nuestra mesa'}
          onClick={() => setPaused((value) => !value)}
        >
          <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>
        </button>
      )}
    </figure>
  )
}
