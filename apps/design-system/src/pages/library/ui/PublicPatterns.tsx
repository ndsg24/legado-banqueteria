import { lazy, Suspense, useState } from 'react'
import { CatalogCard, CategoryMotif } from '@legado/brand/catalog'
import { CatalogDishDetailsDialog } from '@legado/brand/dish-details'
import { useI18n } from '@legado/brand/i18n'
import { ActionButton, NativeSelect } from '@legado/brand/controls'
import { SettingSample } from '@legado/brand/table'
import { catalogCategories } from '@legado/domain/menu/catalog'
import { settingEntries } from '@legado/domain/quote/review'
import { tablePresets } from '@legado/domain/table/options'
import { useSearchParams } from 'react-router'
import { parseTableDesign } from '../../../../../web/src/entities/table'
import { QuoteFields } from './QuoteFields'
import { Gallery } from '../../../../../web/src/widgets/gallery'

const TableEditor = lazy(() =>
  import('../../../../../web/src/widgets/table-designer').then(({ TableEditor }) => ({
    default: TableEditor,
  })),
)
const category = catalogCategories[0]

export function TableSamples() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const [preset, setPreset] = useState(params.has('tablecloth') ? '' : tablePresets[0].id)
  const [design, setDesign] = useState(() => parseTableDesign(params))
  const [showEditor, setShowEditor] = useState(params.has('tablecloth'))
  function pickPreset(id: string) {
    const next = tablePresets.find((option) => option.id === id)
    if (!next) return
    setPreset(id)
    setDesign(next.design)
  }
  return (
    <article className="ds-specimen">
      <h2>Ambientación y plano</h2>
      <p>Los materiales y colores del montaje provienen del diseño de mesa seleccionado.</p>
      <label className="ds-select">
        Propuesta de mesa
        <NativeSelect value={preset} onChange={(event) => pickPreset(event.target.value)}>
          {!preset && <option value="">Diseño compartido</option>}
          {tablePresets.map(({ id, label }) => (
            <option key={id} value={id}>
              {t(label)}
            </option>
          ))}
        </NativeSelect>
      </label>
      <ul className="ds-setting-samples">
        {settingEntries(design, t).map(({ key, label, value }) => (
          <li key={key}>
            <SettingSample
              part={key}
              design={design}
              imageUrl={(path) => import.meta.env.BASE_URL + 'images/' + path + '.webp'}
            />
            <span>
              {label} <strong>{value}</strong>
            </span>
          </li>
        ))}
      </ul>
      <ActionButton
        variant="secondary"
        aria-expanded={showEditor}
        onPress={() => setShowEditor(!showEditor)}
      >
        {showEditor ? 'Cerrar diseñador' : 'Abrir diseñador'}
      </ActionButton>
      {showEditor && (
        <Suspense fallback={<p role="status">Cargando diseñador…</p>}>
          <TableEditor
            key={preset}
            design={design}
            onChange={setDesign}
            sharePage={window.location.href}
          />
        </Suspense>
      )}
    </article>
  )
}

export function GalleryExample() {
  return (
    <article className="ds-specimen">
      <h2>Fotografía y galería</h2>
      <p>
        Abre una fotografía para recorrer el álbum. Escape cierra el visor y devuelve el foco a la
        miniatura.
      </p>
      <Gallery />
    </article>
  )
}

export function CatalogExample() {
  const { t } = useI18n()
  const [active, setActive] = useState<number | null>(null)
  return (
    <article className="ds-specimen">
      <h2>Carta y detalle de plato</h2>
      <p>
        La tarjeta presenta el plato. El diálogo amplía la foto, los ingredientes y la nota de
        degustación.
      </p>
      <ul className="ds-icons">
        {catalogCategories.map(({ id, label }) => (
          <li key={id}>
            <CategoryMotif categoryId={id} />
            {t(label)}
          </li>
        ))}
      </ul>
      <div className="ds-cards">
        {category.items.slice(0, 3).map((item, index) => (
          <CatalogCard
            key={item.id}
            item={item}
            category={category}
            showCategory
            onOpen={() => setActive(index)}
          />
        ))}
      </div>
      {active !== null && (
        <CatalogDishDetailsDialog
          item={category.items[active]}
          category={category}
          onClose={() => setActive(null)}
          onTurn={(direction) => setActive((index) => ((index ?? 0) + direction + 3) % 3)}
        />
      )}
    </article>
  )
}

export function QuoteExample() {
  return (
    <article className="ds-specimen">
      <h2>Cotizador</h2>
      <p>
        El asistente reúne los datos del evento, la selección de platos y salsas, los requisitos
        alimentarios, el contacto y una revisión antes del envío. La selección comienza en el
        cotizador.
      </p>
      <QuoteFields />
      <a href="http://127.0.0.1:5185/legado-banqueteria/cotizar.html">
        Abrir cotizador piloto local
      </a>
    </article>
  )
}
