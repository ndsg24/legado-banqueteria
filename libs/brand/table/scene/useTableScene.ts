import { useEffect, useRef, useState } from 'react'
import type { TableDesign, TablePart } from '@legado/domain/table/types'
import type { TableScene, TableView } from './TableScene'

export function useTableScene(
  design: TableDesign,
  onSelect?: (part: TablePart) => void,
  enabled = true,
  loadMain?: () => Promise<NonNullable<ConstructorParameters<typeof TableScene>[3]>>,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<TableScene | null>(null)
  const latest = useRef({ design, onSelect })
  const requestedView = useRef<TableView>('table')
  const [view, setActiveView] = useState<TableView>('table')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  useEffect(() => {
    latest.current = { design, onSelect }
    sceneRef.current?.setDesign(design)
  }, [design, onSelect])
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    Promise.all([import('./TableScene'), loadMain?.()])
      .then(([{ TableScene }, createMain]) => {
        if (cancelled || !canvasRef.current) return
        try {
          const select = latest.current.onSelect
            ? (part: TablePart) => latest.current.onSelect?.(part)
            : undefined
          const scene = new TableScene(
            canvasRef.current,
            select,
            () => setStatus('error'),
            createMain,
          )
          sceneRef.current = scene
          scene.setDesign(latest.current.design)
          if (requestedView.current !== 'table') scene.setView(requestedView.current)
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
  }, [enabled, loadMain])
  return {
    canvasRef,
    status,
    view,
    capturePreview: () => (status === 'ready' ? sceneRef.current?.capturePreview() : undefined),
    setView: (next: TableView) => {
      requestedView.current = next
      setActiveView(next)
      sceneRef.current?.setView(next)
    },
    saveImage: () => sceneRef.current?.saveImage(),
  }
}
