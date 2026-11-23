import { useEffect, useRef, useState, type ReactNode } from 'react'

import type { TableDesign } from '../../../entities/table'

import { loadServingSurface, tabletopFrame } from '@legado/brand/table-scene'

type SurfaceProps = {
  cloth: string
  runner: string
  overlayStyle: TableDesign['overlayStyle']
  children: ReactNode
}

export function ServingSurface({ cloth, runner, overlayStyle, children }: SurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    let dispose: (() => void) | undefined
    const lost = () => setReady(false)
    canvas.addEventListener('webglcontextlost', lost)
    loadServingSurface()
      .then(({ renderServingSurface }) => {
        if (cancelled) return
        dispose = renderServingSurface(canvas, cloth, runner, overlayStyle)
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) setReady(false)
      })
    return () => {
      cancelled = true
      canvas.removeEventListener('webglcontextlost', lost)
      dispose?.()
    }
  }, [cloth, runner, overlayStyle])
  return (
    <>
      {!ready && (
        <span
          className="serving-table__fallback"
          data-overlay={overlayStyle}
          style={{ ...tabletopFrame, backgroundColor: cloth, color: runner }}
        />
      )}
      <canvas className="serving-table__cloth" ref={canvasRef} />
      <div className="serving-table__top" style={tabletopFrame}>
        {children}
      </div>
    </>
  )
}
