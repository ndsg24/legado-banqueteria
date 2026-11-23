import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CatalogCard } from '@legado/brand/catalog'
import { deviceWidths, type PreviewDevice, type PreviewDish } from '../model/review'
import { previewImage } from '../model/preview-assets'
import documentStyles from './preview-document.css?url'

const focusMargin = 5

type Props = {
  selectedId: string
  dishes: PreviewDish[]
  showCategory: boolean
  device: PreviewDevice
  title: string
  onOpen: () => void
}

export function CatalogCardViewport({
  selectedId,
  dishes,
  showCategory,
  device,
  title,
  onOpen,
}: Props) {
  const host = useRef<HTMLDivElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const [doc, setDoc] = useState<Document | null>(null)
  const [styledDoc, setStyledDoc] = useState<Document | null>(null)
  const attach = useCallback(
    (el: HTMLIFrameElement | null) => setDoc(el?.contentDocument ?? null),
    [],
  )
  const [columns, setColumns] = useState(1)
  const [available, setAvailable] = useState(0)
  const [bounds, setBounds] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const width = deviceWidths[device]
  const index = dishes.findIndex(({ item }) => item.id === selectedId)
  const first = index - (index % columns)
  const row = dishes.slice(first, first + columns)

  useLayoutEffect(() => {
    if (!doc) return
    const root = document.documentElement
    const sync = () => {
      doc.documentElement.lang = root.lang
      doc.documentElement.dataset.theme = root.dataset.theme
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['lang', 'data-theme'] })
    const css = doc.createElement('link')
    css.rel = 'stylesheet'
    css.href = documentStyles
    css.onload = () => setStyledDoc(doc)
    doc.head.append(css)
    return () => {
      observer.disconnect()
      css.onload = null
      css.remove()
    }
  }, [doc])

  useLayoutEffect(() => {
    const element = host.current
    if (!element) return
    const resize = () => setAvailable(element.clientWidth)
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const element = grid.current
    const card = element?.querySelector('.preview-slot:not([inert]) > article')
    const win = doc?.defaultView
    if (!element || !card || !win) return
    const measure = () => {
      setColumns(win.getComputedStyle(element).gridTemplateColumns.split(' ').length)
      const { left, top, width, height } = card.getBoundingClientRect()
      setBounds({ left, top, width, height })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    observer.observe(card)
    return () => observer.disconnect()
  }, [doc, styledDoc, selectedId, index, columns, width, showCategory])

  const scale =
    available && bounds.width ? Math.min(1, available / (bounds.width + 2 * focusMargin)) : 1
  return (
    <div className="audit-preview-stage" ref={host}>
      <div
        className="audit-preview-crop"
        style={{
          width: (bounds.width + 2 * focusMargin) * scale,
          height: (bounds.height + 2 * focusMargin) * scale,
        }}
      >
        <iframe
          title={title}
          srcDoc="<!doctype html><html><head></head><body></body></html>"
          ref={attach}
          onLoad={(event) => setDoc(event.currentTarget.contentDocument)}
          width={width}
          height={Math.ceil(bounds.height + 2 * focusMargin) || 220}
          style={{
            width,
            left: (focusMargin - bounds.left) * scale,
            top: (focusMargin - bounds.top) * scale,
            transform: 'scale(' + scale + ')',
          }}
        />
      </div>
      {doc &&
        styledDoc === doc &&
        createPortal(
          <div className={device === 'desktop' ? 'catalog catalog--desktop' : 'catalog'}>
            <div ref={grid} className="catalog__grid" data-visuals="fallback">
              {row.map(({ item, category }) => (
                <div key={item.id} className="preview-slot" inert={item.id !== selectedId}>
                  <CatalogCard
                    item={item}
                    category={category}
                    resolveImage={previewImage}
                    showCategory={showCategory}
                    onOpen={onOpen}
                  />
                </div>
              ))}
            </div>
          </div>,
          doc.body,
        )}
    </div>
  )
}
