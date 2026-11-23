import { NativeSelect } from '@legado/brand/controls'
import { lazy, Suspense, useRef, useState, type RefObject } from 'react'
import { useI18n } from '@legado/brand/i18n'
import { DottedTexture } from '@legado/brand/dotted-texture'
import { catalogCategories } from '@legado/domain/menu/catalog'
import { reviewCopy } from '../model/copy'
import { previewImage } from '../model/preview-assets'
import { collectionDishes, deviceWidths, type PreviewDevice, type ReviewRow } from '../model/review'
import { CatalogCardViewport } from './CatalogCardViewport'
import './preview.css'

const Details = lazy(() =>
  import('@legado/brand/dish-details').then((module) => ({
    default: module.CatalogDishDetailsDialog,
  })),
)
const devices = ['desktop', 'ipad', 'phone'] as const
const devicePaths = {
  desktop: 'M3 4.5h18v12H3z M8 20h8 M12 16.5V20',
  ipad: 'M5 3h14v18H5z M10 18.5h4',
  phone: 'M7.5 2.5h9v19h-9z M10.5 18.5h3',
}

type Props = {
  headingRef: RefObject<HTMLHeadingElement | null>
  selected: ReviewRow
  singleCategory: boolean
  rows: ReviewRow[]
  onSelect: (id: string) => void
}

export function CatalogPreview({ headingRef, selected, rows, singleCategory, onSelect }: Props) {
  const { language, t } = useI18n()
  const copy = reviewCopy[language]
  const [device, setDevice] = useState<PreviewDevice>(() => {
    if (window.matchMedia('(max-width: 600px)').matches) return 'phone'
    return window.matchMedia('(max-width: 1024px)').matches ? 'ipad' : 'desktop'
  })
  const [detailId, setDetailId] = useState<string | null>(null)
  const sourceButton = useRef<Element | null>(null)
  const names = { desktop: copy.desktop, ipad: 'iPad', phone: copy.phone }
  const dishes = collectionDishes(selected.catalogCategory, singleCategory)
  const index = dishes.findIndex(({ item }) => item.id === detailId)
  const current = dishes[index]
  return (
    <section
      id="catalog-preview"
      className="audit-preview admin-surface"
      aria-labelledby="catalog-preview-name"
    >
      <div className="audit-preview-controls">
        <h2 id="catalog-preview-name" ref={headingRef} tabIndex={-1}>
          {copy.preview}
        </h2>
        <label className="audit-dish-picker">
          {copy.dish}
          <NativeSelect value={selected.id} onChange={(event) => onSelect(event.target.value)}>
            {catalogCategories.map((category) => {
              const choices = rows.filter((entry) => entry.category === category.id)
              return (
                choices.length > 0 && (
                  <optgroup key={category.id} label={t(category.label)}>
                    {choices.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.name}
                      </option>
                    ))}
                  </optgroup>
                )
              )
            })}
          </NativeSelect>
        </label>
        <div className="audit-devices" role="group" aria-label={copy.device}>
          {devices.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={key === device}
              onClick={() => setDevice(key)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path
                  d={devicePaths[key]}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              {names[key]}
            </button>
          ))}
        </div>
      </div>
      <div className="audit-preview-paper">
        <DottedTexture />
        <span className="audit-preview-width">{deviceWidths[device]} px</span>
        <CatalogCardViewport
          selectedId={selected.id}
          dishes={dishes}
          showCategory={device === 'desktop' || !singleCategory}
          device={device}
          title={copy.preview + ' · ' + names[device]}
          onOpen={() => {
            const frame = document.activeElement
            sourceButton.current =
              frame instanceof HTMLIFrameElement
                ? (frame.contentDocument?.activeElement ?? null)
                : null
            setDetailId(selected.id)
          }}
        />
      </div>
      {current && (
        <Suspense fallback={null}>
          <Details
            item={current.item}
            category={current.category}
            resolveImage={previewImage}
            onTurn={(offset) =>
              setDetailId(dishes[(index + offset + dishes.length) % dishes.length].item.id)
            }
            onClose={() => {
              setDetailId(null)
              const button = sourceButton.current as HTMLButtonElement | null
              requestAnimationFrame(() => button?.focus({ preventScroll: true }))
            }}
          />
        </Suspense>
      )}
    </section>
  )
}
