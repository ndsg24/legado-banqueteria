import { useEffect, useRef, useState } from 'react'
import type { TableDesign, TablePart } from '../../../entities/table'
import type { TableScene, TableView } from '../lib/TableScene'

export function useTableScene(
  design: TableDesign,
  onSelect?: (part: TablePart) => void,
  enabled = true,
  serveSalmon = false,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<TableScene | null>(null)
  const latest = useRef({ design, onSelect })
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  useEffect(() => {
    latest.current = { design, onSelect }
    sceneRef.current?.setDesign(design)
  }, [design, onSelect])
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    Promise.all([
      import('../lib/TableScene'),
      serveSalmon ? import('../lib/sundayMain') : undefined,
    ])
      .then(([{ TableScene }, main]) => {
        if (cancelled || !canvasRef.current) return
        try {
          const select = latest.current.onSelect
            ? (part: TablePart) => latest.current.onSelect?.(part)
            : undefined
          const scene = new TableScene(
            canvasRef.current,
            select,
            () => setStatus('error'),
            main?.createSundayMain,
          )
          sceneRef.current = scene
          scene.setDesign(latest.current.design)
          setStatus('ready')
        } catch {
          setStatus('error')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [enabled, serveSalmon])
  return {
    canvasRef,
    status,
    capturePreview: () => (status === 'ready' ? sceneRef.current?.capturePreview() : undefined),
    setView: (view: TableView) => sceneRef.current?.setView(view),
    saveImage: () => sceneRef.current?.saveImage(),
  }
}
