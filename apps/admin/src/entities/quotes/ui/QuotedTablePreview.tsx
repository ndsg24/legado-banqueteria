import { useEffect, useId, useRef, useState } from 'react'
import { useI18n } from '@legado/brand/i18n'
import { TableSceneViewer, useTableScene } from '@legado/brand/table-scene'
import type { TableDesign } from '@legado/domain/table/types'

export function QuotedTablePreview({ design }: { design: TableDesign }) {
  const { t } = useI18n()
  const title = useId()
  const preview = useRef<HTMLElement>(null)
  const [requested, setRequested] = useState(false)
  const scene = useTableScene(design, undefined, requested)

  useEffect(() => {
    if (!preview.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        setRequested(true)
      },
      { rootMargin: '160px' },
    )
    observer.observe(preview.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="quoted-table-preview" ref={preview} aria-labelledby={title}>
      <h3 id={title}>{t('table.view.label')}</h3>
      <TableSceneViewer design={design} scene={scene} />
    </section>
  )
}
